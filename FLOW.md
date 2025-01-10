# Overview of Wallet Credential Issuance with Doc Builder

In order to be able to generate and issue mock credentials in DEV instances of the Doc Builder, Auth Stub and Example CRI stack need to be deployed which refer to each other.

The Doc Builder can then be used to generate a credential which is displayed as en encoded JWT and with decoded claims in the doc-builder UI, and the credential offer is exposed as a link and a QR code so the credential can be retrieved by the app and rendered.

The diagram below shows the call sequence involved:

```mermaid
sequenceDiagram
    autonumber
    participant browser as Browser
    box CRI Stack
        participant cri as Credential Issuer
    end
    box Doc Builder Stack
        participant builder as Document Builder UI
        participant sts as STS Stub
    end
    box Auth Stub Stack
        participant auth as Auth Stub
    end
    
    activate browser
        browser->>builder: GET /select-app
        activate builder
            builder->>auth: GET /authorize
            activate auth
                auth->>auth: stub auth login UI
                auth-->>builder: Auth tokens<br/>GET /select-document
            deactivate auth
            builder->>builder: select document type<br/>GET /build-nino-document
            builder->>cri: GET /credential-offer
            activate cri
                cri->>cri: builder credential offer
                cri-->>builder: return credential offer<br/>GET /view-credential-offer
            deactivate cri
            builder->>sts: get mock access token<br/>POST /token
            activate sts
                sts->>sts: generate access token and c_nonce
                sts-->>builder: return access token
            deactivate sts
            builder->>sts: create mock proof JWT with c_nonce<br/>GET /proof-jwt
            activate sts
                sts->>sts: generate proof JWT
                sts-->>builder: return proof JWT
            deactivate sts
            builder->>cri: POST /credential
            activate cri
                cri->>cri: build credential
                cri-->>builder: return credential
            deactivate cri
            builder->>builder: display credential
        deactivate builder
    deactivate browser
```