//@ts-nocheck
import SibApiV3Sdk from "sib-api-v3-sdk";

let defaultClient = SibApiV3Sdk.ApiClient.instance;

let apiKey = defaultClient.authentications["api-key"];
apiKey.apiKey = process.env.EMAIL_API_KEY;

let apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();

let sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail();

export enum EmailSubjects {
  GetPassword = "Your Paradish Password",
  Register = "Welcome to Paradish",
}

const sendEmail = ({
  subject,
  restaurantName,
  email,
  name,
  htmlTemplate,
}: {
  subject: EmailSubjects;
  restaurantName?: string;
  email: string;
  name?: string;
  htmlTemplate?: string;
}) => {
  sendSmtpEmail.subject = `${subject}`;
  sendSmtpEmail.htmlContent = htmlTemplate ?? "";
  sendSmtpEmail.sender = {
    name: restaurantName ? `${restaurantName} - Paradish` : "Paradish",
    email: "paradish1214@gmail.com",
  };
  sendSmtpEmail.to = [{ email, name }];

  apiInstance.sendTransacEmail(sendSmtpEmail).then(
    function (data) {
      console.log(
        "API called successfully. Returned data: " + JSON.stringify(data)
      );
    },
    function (error) {
      console.error(error);
    }
  );
};

export default sendEmail;
