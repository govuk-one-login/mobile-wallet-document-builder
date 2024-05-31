import { getCustomCredentialOfferUri } from "../../../src/credentialOfferViewer/helpers/customCredentialOfferUri";

describe("customCredentialOfferUri.ts", () => {
  it("should return the URI for the STS app in build", async () => {
    const credentialOfferUri =
      "https://mobile.account.gov.uk/wallet/add?credential_offer=%7B%22credentials%22%3A%5B%22BasicCheckCredential%22%5D%2C%22grants%22%3A%7B%22urn%3Aietf%3Aparams%3Aoauth%3Agrant-type%3Apre-authorized_code%22%3A%7B%22pre-authorized_code%22%3A%22eyJraWQiOiJmZjI3NWI5Mi0wZGVmLTRkZmMtYjBmNi04N2M5NmIyNmM2YzciLCJ0eXAiOiJKV1QiLCJhbGciOiJFUzI1NiJ9.eyJhdWQiOiJ1cm46ZmRjOmdvdjp1azp3YWxsZXQiLCJjbGllbnRJZCI6IkVYQU1QTEVfQ1JJIiwiaXNzIjoidXJuOmZkYzpnb3Y6dWs6ZXhhbXBsZS1jcmVkZW50aWFsLWlzc3VlciIsImNyZWRlbnRpYWxfaWRlbnRpZmllcnMiOlsiMzAzM2VmNjctOGYwOS00MmQyLThhYTQtMmFlZDFhMTU2ZGZmIl0sImV4cCI6MTcxNTYwODU4MywiaWF0IjoxNzE1NjA4MjgzfQ.5n8xVRaOR1H5E7EVkApCwigBNChxTEvMfWCr2KTolKzzqTHdDnJRtprI1rfrqB85DvCqYYYSdsoku6SmZXoHUw%22%7D%7D%2C%22credentialIssuer%22%3A%22http%3A%2F%2Flocalhost%3A8080%22%7D";
    const selectedApp = "govuk-build";
    const error = "";
    const response = getCustomCredentialOfferUri(
      credentialOfferUri,
      selectedApp,
      error
    );

    expect(response).toEqual(
      "https://mobile.build.account.gov.uk/wallet/add?credential_offer=%7B%22credentials%22%3A%5B%22BasicCheckCredential%22%5D%2C%22grants%22%3A%7B%22urn%3Aietf%3Aparams%3Aoauth%3Agrant-type%3Apre-authorized_code%22%3A%7B%22pre-authorized_code%22%3A%22eyJraWQiOiJmZjI3NWI5Mi0wZGVmLTRkZmMtYjBmNi04N2M5NmIyNmM2YzciLCJ0eXAiOiJKV1QiLCJhbGciOiJFUzI1NiJ9.eyJhdWQiOiJ1cm46ZmRjOmdvdjp1azp3YWxsZXQiLCJjbGllbnRJZCI6IkVYQU1QTEVfQ1JJIiwiaXNzIjoidXJuOmZkYzpnb3Y6dWs6ZXhhbXBsZS1jcmVkZW50aWFsLWlzc3VlciIsImNyZWRlbnRpYWxfaWRlbnRpZmllcnMiOlsiMzAzM2VmNjctOGYwOS00MmQyLThhYTQtMmFlZDFhMTU2ZGZmIl0sImV4cCI6MTcxNTYwODU4MywiaWF0IjoxNzE1NjA4MjgzfQ.5n8xVRaOR1H5E7EVkApCwigBNChxTEvMfWCr2KTolKzzqTHdDnJRtprI1rfrqB85DvCqYYYSdsoku6SmZXoHUw%22%7D%7D%2C%22credentialIssuer%22%3A%22http%3A%2F%2Flocalhost%3A8080%22%7D"
    );
  });

  it("should return the URI for the STS app in staging", async () => {
    const credentialOfferUri =
      "https://mobile.account.gov.uk/wallet/add?credential_offer=%7B%22credentials%22%3A%5B%22BasicCheckCredential%22%5D%2C%22grants%22%3A%7B%22urn%3Aietf%3Aparams%3Aoauth%3Agrant-type%3Apre-authorized_code%22%3A%7B%22pre-authorized_code%22%3A%22eyJraWQiOiJmZjI3NWI5Mi0wZGVmLTRkZmMtYjBmNi04N2M5NmIyNmM2YzciLCJ0eXAiOiJKV1QiLCJhbGciOiJFUzI1NiJ9.eyJhdWQiOiJ1cm46ZmRjOmdvdjp1azp3YWxsZXQiLCJjbGllbnRJZCI6IkVYQU1QTEVfQ1JJIiwiaXNzIjoidXJuOmZkYzpnb3Y6dWs6ZXhhbXBsZS1jcmVkZW50aWFsLWlzc3VlciIsImNyZWRlbnRpYWxfaWRlbnRpZmllcnMiOlsiMzAzM2VmNjctOGYwOS00MmQyLThhYTQtMmFlZDFhMTU2ZGZmIl0sImV4cCI6MTcxNTYwODU4MywiaWF0IjoxNzE1NjA4MjgzfQ.5n8xVRaOR1H5E7EVkApCwigBNChxTEvMfWCr2KTolKzzqTHdDnJRtprI1rfrqB85DvCqYYYSdsoku6SmZXoHUw%22%7D%7D%2C%22credentialIssuer%22%3A%22http%3A%2F%2Flocalhost%3A8080%22%7D";
    const selectedApp = "govuk-staging";
    const error = "";
    const response = getCustomCredentialOfferUri(
      credentialOfferUri,
      selectedApp,
      error
    );

    expect(response).toEqual(
      "https://mobile.staging.account.gov.uk/wallet/add?credential_offer=%7B%22credentials%22%3A%5B%22BasicCheckCredential%22%5D%2C%22grants%22%3A%7B%22urn%3Aietf%3Aparams%3Aoauth%3Agrant-type%3Apre-authorized_code%22%3A%7B%22pre-authorized_code%22%3A%22eyJraWQiOiJmZjI3NWI5Mi0wZGVmLTRkZmMtYjBmNi04N2M5NmIyNmM2YzciLCJ0eXAiOiJKV1QiLCJhbGciOiJFUzI1NiJ9.eyJhdWQiOiJ1cm46ZmRjOmdvdjp1azp3YWxsZXQiLCJjbGllbnRJZCI6IkVYQU1QTEVfQ1JJIiwiaXNzIjoidXJuOmZkYzpnb3Y6dWs6ZXhhbXBsZS1jcmVkZW50aWFsLWlzc3VlciIsImNyZWRlbnRpYWxfaWRlbnRpZmllcnMiOlsiMzAzM2VmNjctOGYwOS00MmQyLThhYTQtMmFlZDFhMTU2ZGZmIl0sImV4cCI6MTcxNTYwODU4MywiaWF0IjoxNzE1NjA4MjgzfQ.5n8xVRaOR1H5E7EVkApCwigBNChxTEvMfWCr2KTolKzzqTHdDnJRtprI1rfrqB85DvCqYYYSdsoku6SmZXoHUw%22%7D%7D%2C%22credentialIssuer%22%3A%22http%3A%2F%2Flocalhost%3A8080%22%7D"
    );
  });

  it("should return the URI for the Test app in dev", async () => {
    const credentialOfferUri =
      "https://mobile.account.gov.uk/wallet/add?credential_offer=%7B%22credentials%22%3A%5B%22BasicCheckCredential%22%5D%2C%22grants%22%3A%7B%22urn%3Aietf%3Aparams%3Aoauth%3Agrant-type%3Apre-authorized_code%22%3A%7B%22pre-authorized_code%22%3A%22eyJraWQiOiJmZjI3NWI5Mi0wZGVmLTRkZmMtYjBmNi04N2M5NmIyNmM2YzciLCJ0eXAiOiJKV1QiLCJhbGciOiJFUzI1NiJ9.eyJhdWQiOiJ1cm46ZmRjOmdvdjp1azp3YWxsZXQiLCJjbGllbnRJZCI6IkVYQU1QTEVfQ1JJIiwiaXNzIjoidXJuOmZkYzpnb3Y6dWs6ZXhhbXBsZS1jcmVkZW50aWFsLWlzc3VlciIsImNyZWRlbnRpYWxfaWRlbnRpZmllcnMiOlsiMzAzM2VmNjctOGYwOS00MmQyLThhYTQtMmFlZDFhMTU2ZGZmIl0sImV4cCI6MTcxNTYwODU4MywiaWF0IjoxNzE1NjA4MjgzfQ.5n8xVRaOR1H5E7EVkApCwigBNChxTEvMfWCr2KTolKzzqTHdDnJRtprI1rfrqB85DvCqYYYSdsoku6SmZXoHUw%22%7D%7D%2C%22credentialIssuer%22%3A%22http%3A%2F%2Flocalhost%3A8080%22%7D";
    const selectedApp = "wallet-test-dev";
    const error = "";
    const response = getCustomCredentialOfferUri(
      credentialOfferUri,
      selectedApp,
      error
    );

    expect(response).toEqual(
      "https://mobile.dev.account.gov.uk/wallet-test/add?credential_offer=%7B%22credentials%22%3A%5B%22BasicCheckCredential%22%5D%2C%22grants%22%3A%7B%22urn%3Aietf%3Aparams%3Aoauth%3Agrant-type%3Apre-authorized_code%22%3A%7B%22pre-authorized_code%22%3A%22eyJraWQiOiJmZjI3NWI5Mi0wZGVmLTRkZmMtYjBmNi04N2M5NmIyNmM2YzciLCJ0eXAiOiJKV1QiLCJhbGciOiJFUzI1NiJ9.eyJhdWQiOiJ1cm46ZmRjOmdvdjp1azp3YWxsZXQiLCJjbGllbnRJZCI6IkVYQU1QTEVfQ1JJIiwiaXNzIjoidXJuOmZkYzpnb3Y6dWs6ZXhhbXBsZS1jcmVkZW50aWFsLWlzc3VlciIsImNyZWRlbnRpYWxfaWRlbnRpZmllcnMiOlsiMzAzM2VmNjctOGYwOS00MmQyLThhYTQtMmFlZDFhMTU2ZGZmIl0sImV4cCI6MTcxNTYwODU4MywiaWF0IjoxNzE1NjA4MjgzfQ.5n8xVRaOR1H5E7EVkApCwigBNChxTEvMfWCr2KTolKzzqTHdDnJRtprI1rfrqB85DvCqYYYSdsoku6SmZXoHUw%22%7D%7D%2C%22credentialIssuer%22%3A%22http%3A%2F%2Flocalhost%3A8080%22%7D"
    );
  });

  it("should return the URI for the Test app in build", async () => {
    const credentialOfferUri =
      "https://mobile.account.gov.uk/wallet/add?credential_offer=%7B%22credentials%22%3A%5B%22BasicCheckCredential%22%5D%2C%22grants%22%3A%7B%22urn%3Aietf%3Aparams%3Aoauth%3Agrant-type%3Apre-authorized_code%22%3A%7B%22pre-authorized_code%22%3A%22eyJraWQiOiJmZjI3NWI5Mi0wZGVmLTRkZmMtYjBmNi04N2M5NmIyNmM2YzciLCJ0eXAiOiJKV1QiLCJhbGciOiJFUzI1NiJ9.eyJhdWQiOiJ1cm46ZmRjOmdvdjp1azp3YWxsZXQiLCJjbGllbnRJZCI6IkVYQU1QTEVfQ1JJIiwiaXNzIjoidXJuOmZkYzpnb3Y6dWs6ZXhhbXBsZS1jcmVkZW50aWFsLWlzc3VlciIsImNyZWRlbnRpYWxfaWRlbnRpZmllcnMiOlsiMzAzM2VmNjctOGYwOS00MmQyLThhYTQtMmFlZDFhMTU2ZGZmIl0sImV4cCI6MTcxNTYwODU4MywiaWF0IjoxNzE1NjA4MjgzfQ.5n8xVRaOR1H5E7EVkApCwigBNChxTEvMfWCr2KTolKzzqTHdDnJRtprI1rfrqB85DvCqYYYSdsoku6SmZXoHUw%22%7D%7D%2C%22credentialIssuer%22%3A%22http%3A%2F%2Flocalhost%3A8080%22%7D";
    const selectedApp = "wallet-test-build";
    const error = "";
    const response = getCustomCredentialOfferUri(
      credentialOfferUri,
      selectedApp,
      error
    );

    expect(response).toEqual(
      "https://mobile.build.account.gov.uk/wallet-test/add?credential_offer=%7B%22credentials%22%3A%5B%22BasicCheckCredential%22%5D%2C%22grants%22%3A%7B%22urn%3Aietf%3Aparams%3Aoauth%3Agrant-type%3Apre-authorized_code%22%3A%7B%22pre-authorized_code%22%3A%22eyJraWQiOiJmZjI3NWI5Mi0wZGVmLTRkZmMtYjBmNi04N2M5NmIyNmM2YzciLCJ0eXAiOiJKV1QiLCJhbGciOiJFUzI1NiJ9.eyJhdWQiOiJ1cm46ZmRjOmdvdjp1azp3YWxsZXQiLCJjbGllbnRJZCI6IkVYQU1QTEVfQ1JJIiwiaXNzIjoidXJuOmZkYzpnb3Y6dWs6ZXhhbXBsZS1jcmVkZW50aWFsLWlzc3VlciIsImNyZWRlbnRpYWxfaWRlbnRpZmllcnMiOlsiMzAzM2VmNjctOGYwOS00MmQyLThhYTQtMmFlZDFhMTU2ZGZmIl0sImV4cCI6MTcxNTYwODU4MywiaWF0IjoxNzE1NjA4MjgzfQ.5n8xVRaOR1H5E7EVkApCwigBNChxTEvMfWCr2KTolKzzqTHdDnJRtprI1rfrqB85DvCqYYYSdsoku6SmZXoHUw%22%7D%7D%2C%22credentialIssuer%22%3A%22http%3A%2F%2Flocalhost%3A8080%22%7D"
    );
  });

  it("should return the URI for the Test app in staging", async () => {
    const credentialOfferUri =
      "https://mobile.account.gov.uk/wallet/add?credential_offer=%7B%22credentials%22%3A%5B%22BasicCheckCredential%22%5D%2C%22grants%22%3A%7B%22urn%3Aietf%3Aparams%3Aoauth%3Agrant-type%3Apre-authorized_code%22%3A%7B%22pre-authorized_code%22%3A%22eyJraWQiOiJmZjI3NWI5Mi0wZGVmLTRkZmMtYjBmNi04N2M5NmIyNmM2YzciLCJ0eXAiOiJKV1QiLCJhbGciOiJFUzI1NiJ9.eyJhdWQiOiJ1cm46ZmRjOmdvdjp1azp3YWxsZXQiLCJjbGllbnRJZCI6IkVYQU1QTEVfQ1JJIiwiaXNzIjoidXJuOmZkYzpnb3Y6dWs6ZXhhbXBsZS1jcmVkZW50aWFsLWlzc3VlciIsImNyZWRlbnRpYWxfaWRlbnRpZmllcnMiOlsiMzAzM2VmNjctOGYwOS00MmQyLThhYTQtMmFlZDFhMTU2ZGZmIl0sImV4cCI6MTcxNTYwODU4MywiaWF0IjoxNzE1NjA4MjgzfQ.5n8xVRaOR1H5E7EVkApCwigBNChxTEvMfWCr2KTolKzzqTHdDnJRtprI1rfrqB85DvCqYYYSdsoku6SmZXoHUw%22%7D%7D%2C%22credentialIssuer%22%3A%22http%3A%2F%2Flocalhost%3A8080%22%7D";
    const selectedApp = "wallet-test-staging";
    const error = "";
    const response = getCustomCredentialOfferUri(
      credentialOfferUri,
      selectedApp,
      error
    );

    expect(response).toEqual(
      "https://mobile.staging.account.gov.uk/wallet-test/add?credential_offer=%7B%22credentials%22%3A%5B%22BasicCheckCredential%22%5D%2C%22grants%22%3A%7B%22urn%3Aietf%3Aparams%3Aoauth%3Agrant-type%3Apre-authorized_code%22%3A%7B%22pre-authorized_code%22%3A%22eyJraWQiOiJmZjI3NWI5Mi0wZGVmLTRkZmMtYjBmNi04N2M5NmIyNmM2YzciLCJ0eXAiOiJKV1QiLCJhbGciOiJFUzI1NiJ9.eyJhdWQiOiJ1cm46ZmRjOmdvdjp1azp3YWxsZXQiLCJjbGllbnRJZCI6IkVYQU1QTEVfQ1JJIiwiaXNzIjoidXJuOmZkYzpnb3Y6dWs6ZXhhbXBsZS1jcmVkZW50aWFsLWlzc3VlciIsImNyZWRlbnRpYWxfaWRlbnRpZmllcnMiOlsiMzAzM2VmNjctOGYwOS00MmQyLThhYTQtMmFlZDFhMTU2ZGZmIl0sImV4cCI6MTcxNTYwODU4MywiaWF0IjoxNzE1NjA4MjgzfQ.5n8xVRaOR1H5E7EVkApCwigBNChxTEvMfWCr2KTolKzzqTHdDnJRtprI1rfrqB85DvCqYYYSdsoku6SmZXoHUw%22%7D%7D%2C%22credentialIssuer%22%3A%22http%3A%2F%2Flocalhost%3A8080%22%7D"
    );
  });

  it("should throw an error if there is no path for the selected app", async () => {
    const credentialOfferUri =
      "https://mobile.account.gov.uk/wallet/add?credential_offer=%7B%22credentials%22%3A%5B%22BasicCheckCredential%22%5D%2C%22grants%22%3A%7B%22urn%3Aietf%3Aparams%3Aoauth%3Agrant-type%3Apre-authorized_code%22%3A%7B%22pre-authorized_code%22%3A%22eyJraWQiOiJmZjI3NWI5Mi0wZGVmLTRkZmMtYjBmNi04N2M5NmIyNmM2YzciLCJ0eXAiOiJKV1QiLCJhbGciOiJFUzI1NiJ9.eyJhdWQiOiJ1cm46ZmRjOmdvdjp1azp3YWxsZXQiLCJjbGllbnRJZCI6IkVYQU1QTEVfQ1JJIiwiaXNzIjoidXJuOmZkYzpnb3Y6dWs6ZXhhbXBsZS1jcmVkZW50aWFsLWlzc3VlciIsImNyZWRlbnRpYWxfaWRlbnRpZmllcnMiOlsiMzAzM2VmNjctOGYwOS00MmQyLThhYTQtMmFlZDFhMTU2ZGZmIl0sImV4cCI6MTcxNTYwODU4MywiaWF0IjoxNzE1NjA4MjgzfQ.5n8xVRaOR1H5E7EVkApCwigBNChxTEvMfWCr2KTolKzzqTHdDnJRtprI1rfrqB85DvCqYYYSdsoku6SmZXoHUw%22%7D%7D%2C%22credentialIssuer%22%3A%22http%3A%2F%2Flocalhost%3A8080%22%7D";
    const selectedApp = "unknownOption";
    const error = "";

    expect(() => {
      getCustomCredentialOfferUri(credentialOfferUri, selectedApp, error);
    }).toThrow("Path not found");
  });

  it("should throw an error if the URI returned by the CRI is invalid", async () => {
    const credentialOfferUri =
      "https://not.the.expected.uri/wallet/add?credential_offer=%7B%22credentials%22%3A%5B%22BasicCheckCredential%22%5D%2C%22grants%22%3A%7B%22urn%3Aietf%3Aparams%3Aoauth%3Agrant-type%3Apre-authorized_code%22%3A%7B%22pre-authorized_code%22%3A%22eyJraWQiOiJmZjI3NWI5Mi0wZGVmLTRkZmMtYjBmNi04N2M5NmIyNmM2YzciLCJ0eXAiOiJKV1QiLCJhbGciOiJFUzI1NiJ9.eyJhdWQiOiJ1cm46ZmRjOmdvdjp1azp3YWxsZXQiLCJjbGllbnRJZCI6IkVYQU1QTEVfQ1JJIiwiaXNzIjoidXJuOmZkYzpnb3Y6dWs6ZXhhbXBsZS1jcmVkZW50aWFsLWlzc3VlciIsImNyZWRlbnRpYWxfaWRlbnRpZmllcnMiOlsiMzAzM2VmNjctOGYwOS00MmQyLThhYTQtMmFlZDFhMTU2ZGZmIl0sImV4cCI6MTcxNTYwODU4MywiaWF0IjoxNzE1NjA4MjgzfQ.5n8xVRaOR1H5E7EVkApCwigBNChxTEvMfWCr2KTolKzzqTHdDnJRtprI1rfrqB85DvCqYYYSdsoku6SmZXoHUw%22%7D%7D%2C%22credentialIssuer%22%3A%22http%3A%2F%2Flocalhost%3A8080%22%7D";
    const selectedApp = "wallet-test-staging";
    const error = "";

    expect(() => {
      getCustomCredentialOfferUri(credentialOfferUri, selectedApp, error);
    }).toThrow("Invalid URI");
  });

  it("should not replace the pre-authorized code when error is falsy", async () => {
    const credentialOfferUri =
      "https://mobile.account.gov.uk/wallet/add?credential_offer=%7B%22credentials%22%3A%5B%22BasicCheckCredential%22%5D%2C%22grants%22%3A%7B%22urn%3Aietf%3Aparams%3Aoauth%3Agrant-type%3Apre-authorized_code%22%3A%7B%22pre-authorized_code%22%3A%22eyJraWQiOiJmZjI3NWI5Mi0wZGVmLTRkZmMtYjBmNi04N2M5NmIyNmM2YzciLCJ0eXAiOiJKV1QiLCJhbGciOiJFUzI1NiJ9.eyJhdWQiOiJ1cm46ZmRjOmdvdjp1azp3YWxsZXQiLCJjbGllbnRJZCI6IkVYQU1QTEVfQ1JJIiwiaXNzIjoidXJuOmZkYzpnb3Y6dWs6ZXhhbXBsZS1jcmVkZW50aWFsLWlzc3VlciIsImNyZWRlbnRpYWxfaWRlbnRpZmllcnMiOlsiMzAzM2VmNjctOGYwOS00MmQyLThhYTQtMmFlZDFhMTU2ZGZmIl0sImV4cCI6MTcxNTYwODU4MywiaWF0IjoxNzE1NjA4MjgzfQ.5n8xVRaOR1H5E7EVkApCwigBNChxTEvMfWCr2KTolKzzqTHdDnJRtprI1rfrqB85DvCqYYYSdsoku6SmZXoHUw%22%7D%7D%2C%22credentialIssuer%22%3A%22http%3A%2F%2Flocalhost%3A8080%22%7D";
    const selectedApp = "govuk-build";
    const error = "";
    const response = getCustomCredentialOfferUri(
      credentialOfferUri,
      selectedApp,
      error
    );

    expect(response).toEqual(
      "https://mobile.build.account.gov.uk/wallet/add?credential_offer=%7B%22credentials%22%3A%5B%22BasicCheckCredential%22%5D%2C%22grants%22%3A%7B%22urn%3Aietf%3Aparams%3Aoauth%3Agrant-type%3Apre-authorized_code%22%3A%7B%22pre-authorized_code%22%3A%22eyJraWQiOiJmZjI3NWI5Mi0wZGVmLTRkZmMtYjBmNi04N2M5NmIyNmM2YzciLCJ0eXAiOiJKV1QiLCJhbGciOiJFUzI1NiJ9.eyJhdWQiOiJ1cm46ZmRjOmdvdjp1azp3YWxsZXQiLCJjbGllbnRJZCI6IkVYQU1QTEVfQ1JJIiwiaXNzIjoidXJuOmZkYzpnb3Y6dWs6ZXhhbXBsZS1jcmVkZW50aWFsLWlzc3VlciIsImNyZWRlbnRpYWxfaWRlbnRpZmllcnMiOlsiMzAzM2VmNjctOGYwOS00MmQyLThhYTQtMmFlZDFhMTU2ZGZmIl0sImV4cCI6MTcxNTYwODU4MywiaWF0IjoxNzE1NjA4MjgzfQ.5n8xVRaOR1H5E7EVkApCwigBNChxTEvMfWCr2KTolKzzqTHdDnJRtprI1rfrqB85DvCqYYYSdsoku6SmZXoHUw%22%7D%7D%2C%22credentialIssuer%22%3A%22http%3A%2F%2Flocalhost%3A8080%22%7D"
    );
  });

  it("should replace the pre-authorized code with 'ERROR:500", async () => {
    const credentialOfferUri =
      "https://mobile.account.gov.uk/wallet/add?credential_offer=%7B%22credentials%22%3A%5B%22BasicCheckCredential%22%5D%2C%22grants%22%3A%7B%22urn%3Aietf%3Aparams%3Aoauth%3Agrant-type%3Apre-authorized_code%22%3A%7B%22pre-authorized_code%22%3A%22eyJraWQiOiJmZjI3NWI5Mi0wZGVmLTRkZmMtYjBmNi04N2M5NmIyNmM2YzciLCJ0eXAiOiJKV1QiLCJhbGciOiJFUzI1NiJ9.eyJhdWQiOiJ1cm46ZmRjOmdvdjp1azp3YWxsZXQiLCJjbGllbnRJZCI6IkVYQU1QTEVfQ1JJIiwiaXNzIjoidXJuOmZkYzpnb3Y6dWs6ZXhhbXBsZS1jcmVkZW50aWFsLWlzc3VlciIsImNyZWRlbnRpYWxfaWRlbnRpZmllcnMiOlsiMzAzM2VmNjctOGYwOS00MmQyLThhYTQtMmFlZDFhMTU2ZGZmIl0sImV4cCI6MTcxNTYwODU4MywiaWF0IjoxNzE1NjA4MjgzfQ.5n8xVRaOR1H5E7EVkApCwigBNChxTEvMfWCr2KTolKzzqTHdDnJRtprI1rfrqB85DvCqYYYSdsoku6SmZXoHUw%22%7D%7D%2C%22credentialIssuer%22%3A%22http%3A%2F%2Flocalhost%3A8080%22%7D";
    const selectedApp = "govuk-build";
    const error = "ERROR:500";
    const response = getCustomCredentialOfferUri(
      credentialOfferUri,
      selectedApp,
      error
    );

    expect(response).toEqual(
      "https://mobile.build.account.gov.uk/wallet/add?credential_offer=%7B%22credentials%22%3A%5B%22BasicCheckCredential%22%5D%2C%22grants%22%3A%7B%22urn%3Aietf%3Aparams%3Aoauth%3Agrant-type%3Apre-authorized_code%22%3A%7B%22pre-authorized_code%22%3A%22ERROR%3A500%22%7D%7D%2C%22credentialIssuer%22%3A%22http%3A%2F%2Flocalhost%3A8080%22%7D"
    );
  });

  it("should throw an error if the credential offer in the URI returned by the CRI does not match the expected pattern", async () => {
    const credentialOfferUri =
      "https://mobile.account.gov.uk/wallet/add?credential_broken_offer=%7B%22credentials%22%3A%5B%22BasicCheckCredential%22%5D%2C%22grants%22%3A%7B%22urn%3Aietf%3Aparams%3Aoauth%3Agrant-type%3Apre-authorized_code%22%3A%7B%22pre-authorized_code%22%3A%22eyJraWQiOiJmZjI3NWI5Mi0wZGVmLTRkZmMtYjBmNi04N2M5NmIyNmM2YzciLCJ0eXAiOiJKV1QiLCJhbGciOiJFUzI1NiJ9.eyJhdWQiOiJ1cm46ZmRjOmdvdjp1azp3YWxsZXQiLCJjbGllbnRJZCI6IkVYQU1QTEVfQ1JJIiwiaXNzIjoidXJuOmZkYzpnb3Y6dWs6ZXhhbXBsZS1jcmVkZW50aWFsLWlzc3VlciIsImNyZWRlbnRpYWxfaWRlbnRpZmllcnMiOlsiMzAzM2VmNjctOGYwOS00MmQyLThhYTQtMmFlZDFhMTU2ZGZmIl0sImV4cCI6MTcxNTYwODU4MywiaWF0IjoxNzE1NjA4MjgzfQ.5n8xVRaOR1H5E7EVkApCwigBNChxTEvMfWCr2KTolKzzqTHdDnJRtprI1rfrqB85DvCqYYYSdsoku6SmZXoHUw%22%7D%7D%2C%22credentialIssuer%22%3A%22http%3A%2F%2Flocalhost%3A8080%22%7D";
    const selectedApp = "wallet-test-staging";
    const error = "ERROR:500";

    expect(() => {
      getCustomCredentialOfferUri(credentialOfferUri, selectedApp, error);
    }).toThrow("Invalid URI");
  });
});
