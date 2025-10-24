jest.mock("../../../src/config/appConfig", () => ({
  APPS: [
    {
      text: "App A (Staging)",
      value: "app-a-staging",
      environment: "staging",
      path: "https://mobile.staging.com/app/",
    },
    {
      text: "App B (Build)",
      value: "app-b-build",
      environment: "build",
      path: "https://mobile.build.com/app/",
    },
    {
      text: "App C (Dev)",
      value: "app-c-dev",
      environment: "dev",
      path: "https://mobile.dev.com/app/",
    },
  ],
}));

import { getAppsByEnvironment } from "../../../src/appSelector/utils/getAppsByEnvironment";

describe("getAppsByEnvironment", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should return only staging apps when environment=staging", () => {
    const appsInStaging = getAppsByEnvironment("staging");

    const expected = [{ text: "App A (Staging)", value: "app-a-staging" }];

    expect(appsInStaging).toEqual(expected);
  });

  it("should return only non-staging apps when environment≠staging", () => {
    const appsInBuild = getAppsByEnvironment("build");
    const appsInDev = getAppsByEnvironment("dev");

    const expected = [
      { text: "App B (Build)", value: "app-b-build" },
      { text: "App C (Dev)", value: "app-c-dev" },
    ];

    expect(appsInBuild).toEqual(expected);
    expect(appsInDev).toEqual(expected);
  });
});
