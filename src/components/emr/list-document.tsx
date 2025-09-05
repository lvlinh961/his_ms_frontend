export type EmrDocumentItem = {
  title: String;
  url: String;
};

export type EmrDocumentGroup = {
  title: String;
  items: EmrDocumentItem[];
};

export const listsEmrItem: EmrDocumentGroup[] = [
  {
    title: "Bìa hồ sơ",
    items: [],
  },
  {
    title: "Bệnh án",
    items: [
      {
        title: "Hồ sơ bệnh án",
        url: "",
      },
      {
        title: "Tờ điều trị",
        url: "",
      },
    ],
  },
  {
    title: "Phiếu chăm sóc",
    items: [
      {
        title: "Phiếu chăm sóc cấp 2",
        url: "",
      },
      {
        title: "Phiếu chăm sóc cấp 3",
        url: "",
      },
    ],
  },
  {
    title: "Tường trình phẫu thuật",
    items: [
      {
        title: "Phiếu tường trình PT/TT",
        url: "",
      },
      {
        title: "Giấy cam đoan phẫu thuật",
        url: "",
      },
      {
        title: "Phiếu đồng thuận truyền máu",
        url: "",
      },
    ],
  },
];
