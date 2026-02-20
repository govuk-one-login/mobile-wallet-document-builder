import { Request, Response } from "express";
import {
  formatValidationError,
  generateErrorList,
  renderBadRequest,
} from "../../src/utils/validation";
import { getMockReq, getMockRes } from "@jest-mock/express";

describe("formatValidationError", () => {
  it("should return a formatted error object with the correct key and message", () => {
    const key = "testField";
    const message = "This is a validation error";
    const result = formatValidationError(key, message);

    expect(result).toEqual({
      [key]: {
        text: message,
        href: `#${key}`,
      },
    });
  });
});

describe("generateErrorList", () => {
  it("should return a list of unique error values", () => {
    const errors = {
      field1: { text: "Error message 1", href: "#field1" },
      field2: { text: "Error message 2", href: "#field2" },
      field3: { text: "Error message 1", href: "#field3" }, // Duplicate message
    };

    const result = generateErrorList(errors);

    expect(result).toHaveLength(2);
    expect(result).toContainEqual(errors.field2);
    expect(result).toContainEqual(errors.field3);
    expect(result).not.toContainEqual(errors.field1);
  });

  it("should return all errors if all messages are unique", () => {
    const errors = {
      field1: { text: "Error message 1", href: "#field1" },
      field2: { text: "Error message 2", href: "#field2" },
    };

    const result = generateErrorList(errors);

    expect(result).toHaveLength(2);
    expect(result).toContainEqual(errors.field1);
    expect(result).toContainEqual(errors.field2);
  });
});

describe("renderBadRequest", () => {
  let mockRequest: Request;
  let mockResponse: Response;
  const template = "test-template";
  const errors = {
    field1: { text: "Error 1", href: "#field1" },
  };

  beforeEach(() => {
    mockRequest = getMockReq({
      body: { someField: "someValue" },
    });
    mockResponse = getMockRes().res;
  });

  it("should set status to 400 and render the template with correct data", () => {
    renderBadRequest(mockResponse, mockRequest, template, errors);

    expect(mockResponse.status).toHaveBeenCalledWith(400);
    expect(mockResponse.render).toHaveBeenCalledWith(template, {
      errors,
      errorList: generateErrorList(errors),
      someField: "someValue",
    });
  });

  it("should merge options into the render data", () => {
    const options = { extra: "data" };
    renderBadRequest(
      mockResponse as Response,
      mockRequest as Request,
      template,
      errors,
      options,
    );

    expect(mockResponse.render).toHaveBeenCalledWith(template, {
      errors,
      errorList: generateErrorList(errors),
      someField: "someValue",
      extra: "data",
    });
  });

  it("should handle empty body", () => {
    mockRequest.body = {};
    renderBadRequest(
      mockResponse as Response,
      mockRequest as Request,
      template,
      errors,
    );

    expect(mockResponse.render).toHaveBeenCalledWith(template, {
      errors,
      errorList: generateErrorList(errors),
    });
  });
});
