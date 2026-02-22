import { asyncHandler } from "../../utils/asyncHandler.js";
import { ApiResponse } from "../../utils/ApiResponse.js";
import { 
  getStatesService, 
  getDistrictsByStateService, 
  getCollegesByDistrictService, 
  getHostelsByCollegeService 
} from "../../services/location.service.js";

export const getStates = asyncHandler(async (req, res) => {
  const states = await getStatesService();
  return res.status(200).json(new ApiResponse(200, states, "States fetched for customer successfully"));
});

export const getDistricts = asyncHandler(async (req, res) => {
  const districts = await getDistrictsByStateService(req.params.stateId);
  return res.status(200).json(new ApiResponse(200, districts, "Districts fetched for customer successfully"));
});

export const getColleges = asyncHandler(async (req, res) => {
  const colleges = await getCollegesByDistrictService(req.params.districtId);
  return res.status(200).json(new ApiResponse(200, colleges, "Colleges fetched for customer successfully"));
});

export const getHostels = asyncHandler(async (req, res) => {
  const hostels = await getHostelsByCollegeService(req.params.collegeId);
  return res.status(200).json(new ApiResponse(200, hostels, "Hostels fetched for customer successfully"));
});