import { Request, Response } from "express";
import { logger } from "../middleware/logger";
import { isAuthenticated } from "../utils/isAuthenticated";
import {getCookieExpiry} from "../config/appConfig";
import {ExpressRouteFunction} from "../types/ExpressRouteFunction";


export interface DataModelSelectorConfig {
    cookieExpiry?: number;
    setCookie: (res: Response, name: string, value: string) => void;
}

export function dataModelSelectorGetController(
    req: Request,
    res: Response
): void {

    try {
        res.render("select-vc-data-model-form.njk", {
            authenticated: isAuthenticated(req),
        });
    } catch (error) {
        logger.error(error, "An error happened rendering data model selection page");
        res.render("500.njk");
    }
}

export function dataModelSelectorPostController(
    config: DataModelSelectorConfig = {
        cookieExpiry: getCookieExpiry(),
        setCookie: (res: Response, name: string, value: string) => {
            res.cookie(name, value, {
                httpOnly: true,
                maxAge: config.cookieExpiry,
            });
        },
    }
): ExpressRouteFunction {
    return function (req: Request, res: Response): void {
        try {
            const selectedDataModel = req.body["select-vc-data-model-choice"];

            if (selectedDataModel) {
                res.cookie("dataModel", selectedDataModel, {
                    httpOnly: true,
                    maxAge: config.cookieExpiry,
                })
                res.redirect(`/select-document`);
            } else {
                res.render("select-vc-data-model-form.njk", {
                    isInvalid: selectedDataModel === undefined,
                    authenticated: isAuthenticated(req),
                });
            }
        } catch (error) {
            logger.error(error, "An error happened selecting data model");
            res.render("500.njk");
        }
    };
}
