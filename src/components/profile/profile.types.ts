export type ProvinceAutoSuggest = {
  id: number;
  viName: string;
};

export type WardAutoSuggest = {
  id: number;
  provinceId: number;
  viName: string;
  provinceName: string;
};

export type CareerAutoSuggest = {
  id: number;
  code: string;
  viName: string;
};

export type NationalityAutoSuggest = {
  id: number;
  viName: string;
};

export type EthnicGroupAutoSuggest = {
  id: number;
  code: string;
  viName: string;
};
