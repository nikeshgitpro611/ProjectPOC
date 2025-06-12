import Listing from "../models/listing.modal.js";
import { errorHandler } from "../utils/error.js";

export const createTargetRule = async (req, res, next) => {
  try {
    const listing = await Listing.create(req.body);
    res.status(201).json(listing);
  } catch (error) {
    next(error);
  }
};

export const deleteTargetRuleImage = async (req, res, next) => {
  console.log("req.user.id", req.user.id);
  
  const listing = await Listing.findById(req.params.id);
  
  if (!listing) return next(errorHandler(404, "Listing not found"));
  if (req.user.id !== listing.userRef)
    return next(errorHandler(403, "You can only delete your listing"));

  try {
    const deletedListing = await Listing.findByIdAndDelete(req.params.id);
    // console.log("deletedListing", deletedListing);

    res.status(200).json("Listing deleted successfully");
  } catch (error) {
    next(error);
  }
};
