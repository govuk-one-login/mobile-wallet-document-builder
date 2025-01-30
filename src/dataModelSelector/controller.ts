import { Request, Response } from "express";
import { logger } from "../middleware/logger";
import { isAuthenticated } from "../utils/isAuthenticated";
import {getCookieExpiry} from "../config/appConfig";
import {ExpressRouteFunction} from "../types/ExpressRouteFunction";


export interface DataModelSelectorConfig {
    cookieExpiry?: number;
    setCookie: (res: Response, name: string, value: string) => void;
    getCookie: (req: Request, name: string) => string | undefined;
}

export function dataModelSelectorGetController(
    req: Request,
    res: Response
): void {
    console.log("Hello")
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
        getCookie: (req: Request, name: string) => {
            return req.cookies[name];
        },
    }
): ExpressRouteFunction {
    return function (req: Request, res: Response): void {
        try {
            const selectedDataModel = req.body["select-vc-data-model-choice"];

            if (selectedDataModel === "v1.1" || selectedDataModel === "v2.0") {
                config.setCookie(res, selectedDataModel, selectedDataModel);
                res.redirect(`/select-document`);
            } else {
                res.render("select-vc-data-model-form.njk", {
                    isInvalid: selectedDataModel === undefined,
                    authenticated: isAuthenticated(req),
                });
            }
        } catch (error) {
            logger.error(error, "An error happened selecting app");
            res.render("500.njk");
        }
    };
}
