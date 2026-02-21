import SibApiV3Sdk from "sib-api-v3-sdk";
import { envConfig } from "./env.config.js";

const defaultClient = SibApiV3Sdk.ApiClient.instance;

// Configure API key authorization
const apiKey = defaultClient.authentications['api-key'];
apiKey.apiKey = envConfig.brevo.apiKey;

export const transactionalEmailsApi = new SibApiV3Sdk.TransactionalEmailsApi();
export const sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail();