export interface Apps {
    [key: string]: App;
}

export interface App {
    path:  string;
    login: boolean;
}

// REMEMBER TO USE THIS CONSTANT IN THE CREDENTIAL OFFER VIEWER
export const apps: Apps = {
    "govuk-build": {
        path: "https://mobile.build.account.gov.uk/wallet/",
        login: false
    },
    "govuk-staging": {
        path: "https://mobile.staging.account.gov.uk/wallet/",
        login: true
    },
    "wallet-test-dev": {
        path: "https://mobile.build.account.gov.uk/wallet/",
        login: false
    },
    "wallet-test-build": {
        path: "https://mobile.dev.account.gov.uk/wallet-test/",
        login: false
    },
    "wallet-test-staging": {
        path: "https://mobile.staging.account.gov.uk/wallet-test/",
        login: true
    },
}