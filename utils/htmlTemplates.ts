export enum HtmlTemplates {
  REGISTER_RESTAURANT = "registerRestaurant",
}

export const getHtmlTemplate = (type: HtmlTemplates, data: any) => {
  switch (type) {
    case HtmlTemplates.REGISTER_RESTAURANT:
      return `<div style="background-color: #f5f5f5; padding: 20px;">
    <div style="max-width: 600px; margin: 0 auto; background-color: #fff; padding: 20px;">
        <div style="text-align: center;">
            <img src="https://paradish.vercel.app/logo.png" alt="Paradish Logo" style="width: 100px; height: 100px;" />
        </div>
        <h1 style="text-align: center;">Welcome to Paradish</h1>
        <p style="text-align: center;">You have successfully registered your restaurant ${data.name} on Paradish.</p>
        <p style="text-align: center;">You can now start adding your menu items and start taking orders.</p>
        <p style="text-align: center;">If you have any questions, please contact us at
            <a href="mailto:paradish1214@gmail.com">
            paradish1214@gmail.com</a>
        </p>
    </div>
</div>`;
  }
};
