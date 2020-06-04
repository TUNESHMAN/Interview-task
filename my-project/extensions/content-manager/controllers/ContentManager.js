"use strict";

const _ = require("lodash");

const parseMultipartBody = require("../utils/parse-multipart");
// const {
//   validateGenerateUIDInput,
//   validateCheckUIDAvailabilityInput,
//   validateUIDField,
// } = require("./validation");

module.exports = {
  //   Creates an entity of a content type

  async create(ctx) {
    const contentManagerService =
      strapi.plugins["content-manager"].services.contentmanager;

    const { model } = ctx.params;
    console.log(`Added`);

    try {
      if (ctx.is("multipart")) {
        const { data, files } = parseMultipartBody(ctx);
        
        const author = await strapi
          .query("user", "users-permissions")
          .findOne({ id: data.id });

          console.log(author);

          await strapi.plugins['email'].services.email.send({
            to: author.email,
            from: 'joelrobuchon@strapi.io',
            cc: 'helenedarroze@strapi.io',
            bcc: 'ghislainearabian@strapi.io',
            replyTo: 'annesophiepic@strapi.io',
            subject: 'Use strapi email provider successfully',
            text: 'Hello world!',
            html: 'Hello world!',
          });

        ctx.body = await contentManagerService.create(data, { files, model });
      } else {
        // Create an entry using `queries` system
        ctx.body = await contentManagerService.create(ctx.request.body, {
          model,
        });
      }

      await strapi.telemetry.send("didCreateFirstContentTypeEntry", { model });
    } catch (error) {
      strapi.log.error(error);
      ctx.badRequest(null, [
        {
          messages: [
            { id: error.message, message: error.message, field: error.field },
          ],
          errors: _.get(error, "data.errors"),
        },
      ]);
    }
  },
};
