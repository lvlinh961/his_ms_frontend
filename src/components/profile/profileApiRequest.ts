import { ApiResponseInterface } from "@/types";
import http from "@/lib/http";
import {
  ProvinceAutoSuggest,
  WardAutoSuggest,
  CareerAutoSuggest,
  NationalityAutoSuggest,
  EthnicGroupAutoSuggest,
} from "./profile.types";

const profileApiRequest = {
  provinceAutoSuggest: (query: string) =>
    http.get<ApiResponseInterface<ProvinceAutoSuggest[]>>(
      "/profile/provinces/auto_suggest?query=" + query
    ),

  wardAutoSuggest: (provinceId: number, query: string) =>
    http.get<ApiResponseInterface<WardAutoSuggest[]>>(
      `/profile/wards/auto_suggest?provinceId=${provinceId}&query=${query}`
    ),

  careerAutoSuggest: (query: string) =>
    http.get<ApiResponseInterface<CareerAutoSuggest[]>>(
      `/profile/careers/auto_suggest?&query=${query}`
    ),

  nationalityAutoSuggest: (query: string) =>
    http.get<ApiResponseInterface<NationalityAutoSuggest[]>>(
      `/profile/nationalities/auto_suggest?&query=${query}`
    ),

  ethnicGroupAutoSuggest: (query: string) =>
    http.get<ApiResponseInterface<EthnicGroupAutoSuggest[]>>(
      `/profile/ethnic_groups/auto_suggest?&query=${query}`
    ),
};

export default profileApiRequest;
