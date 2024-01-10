import express from "express";
import validate from "../../middlewares/validate";
import { campaignValidation } from "../../validations";
import { campaignController } from "../../controllers";

const router = express.Router();

router.post(
  "/create",
  validate(campaignValidation.createCampaign),
  campaignController.createCampaign
);

// All campaigns page
router.get("/list", campaignController.listCampaigns);

router
  .route("/:campaignId")
  .get(
    validate(campaignValidation.findCampaignById),
    campaignController.findCampaignById
  )
  .patch(
    validate(campaignValidation.updateCampaignById),
    campaignController.updateCampaignById
  )
  .delete(
    validate(campaignValidation.deleteCampaignById),
    campaignController.deleteCampaignById
  );

export default router;

/**
 * @swagger
 * tags:
 *  name: Campaigns
 *  description: Campaign management and retrieval
 */

/**
 * @swagger
 * /campaign/create:
 *  post:
 *   summary: Create a campaign
 *   description: Create a campaigns.
 *   tags: [Campaign]
 *   requestBody:
 *    required: true
 *    content:
 *     application/json:
 *      schema:
 *       type: object
 *       required:
 *        - startDate
 *        - endDate
 *        - title
 *        - currency
 *        - dollars
 *        - cents
 *        - createdBy
 *        - editedBy
 *       properties:
 *        status:
 *         type: string
 *        startDate:
 *         type: date
 *        endDate:
 *         type: date
 *        title:
 *         type: string
 *        description:
 *         type: string
 *        currency:
 *         type: string
 *        dollars:
 *         type: number
 *        cents:
 *         type: number
 *        createdBy:
 *         type: string
 *        editedBy:
 *         type: string
 *        imageUrl:
 *         type: array
 *    responses:
 *     "201":
 *      description: Created
 *      content:
 *       application/json:
 *        schema:
 *         $ref: '#/components/schemas/Campaign'
 *     "400":
 *      $ref: '#/components/responses/DuplicateCampaign'
 *     "500":
 *      $ref: '#/components/responses/InternalServerError'
 *
 */
