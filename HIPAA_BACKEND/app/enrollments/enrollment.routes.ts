import { Router } from "express";
import enrollmentServices from "./enrollment.services";
import { ResponseHandler } from "../utils/response-handler";
import { enrollUserValidations } from "./enrollment.validations";
import { Route } from "../routes/routes.types";
import { upload } from "../utils/file-uploader";
import { body } from "../utils/validator";
import path from "path";
import { enrollmentResponses } from "./enrollment.responses";

const router = Router();

router.post("/", async (req, res, next) => {
  try {

    const userId = req.currUser.id;
    const enrollment = await enrollmentServices.enrollUser(userId);
    res.send(new ResponseHandler(enrollment));
  } catch (error) {
    next(error);
  }
});

router.post(
  "/upload-certificate/:enrollmentId",
  upload.single("certificate"),
  async (req, res, next) => {
    try {
      const enrollmentId = req.params.enrollmentId;
      if (req.file) {
        const response = await enrollmentServices.handleCertificate(
          enrollmentId,
          req.file.path,
          "upload"
        );
        res.send(new ResponseHandler(response));
      }
    } catch (error) {
      next(error);
    }
  }
);

router.patch(
  "/edit-certificate/:enrollmentId",
  upload.single("certificate"),
  async (req, res, next) => {
    try {
      const enrollmentId = req.params.enrollmentId;
      if (req.file) {
        const response = await enrollmentServices.handleCertificate(
          enrollmentId,
          req.file.path,
          "edit"
        );
        res.send(new ResponseHandler(response));
      }
    } catch (error) {
      next(error);
    }
  }
);

router.get("/download-certificate/:enrollmentId", async (req, res, next) => {
  try {
    const enrollmentId = req.params.enrollmentId;
    const certificatePath = await enrollmentServices.getCertificate(enrollmentId);
    res.download(certificatePath, (err) => {
      if (err) {
        next(err);
      }
    });
  } catch (error) {
    next(error);
  }
});

router.get("/completed-modules", async (req, res, next) => {
  try {

    const userId = req.currUser.id;

    const completedModules = await enrollmentServices.getCompletedModules(userId);
    res.send(new ResponseHandler(completedModules));
  } catch (error) {
    next(error);
  }
});



export default new Route("/api/enrol", router);

