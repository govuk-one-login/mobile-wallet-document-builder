import { DrivingLicenceData } from "../../drivingLicenceBuilder/types/DrivingLicenceData";
import { formatDate } from "../../utils/date";

/**
 * Builds the default data for the driving licence document for the DVS journey.
 *
 * @param s3Uri - The S3 URI where the portrait image is stored.
 * @returns The default driving licence data.
 */
export function buildDefaultDrivingLicenceData(
  s3Uri: string,
): DrivingLicenceData {
  const now = new Date();
  const nowPlus30Days = new Date();
  nowPlus30Days.setDate(nowPlus30Days.getDate() + 30);
  const dateToday = formatDate(
    now.getDate().toString(),
    (now.getMonth() + 1).toString(),
    now.getFullYear().toString(),
  );
  const dateIn30Days = formatDate(
    nowPlus30Days.getDate().toString(),
    (nowPlus30Days.getMonth() + 1).toString(),
    nowPlus30Days.getFullYear().toString(),
  );

  return {
    family_name: "Test FirstName",
    given_name: "Test-Surname",
    title: "Dr",
    welsh_licence: false,
    portrait: s3Uri,
    birth_date: "21-06-2000",
    birth_place: "Birth city",
    issue_date: dateToday,
    expiry_date: dateIn30Days,
    issuing_authority: "GDS",
    issuing_country: "GB",
    document_number: "TEST" + Date.now(),
    resident_address: "Flat test, Building X, Street test",
    resident_postal_code: "XX1 3XX",
    resident_city: "City test",
    driving_privileges: getDrivingPrivileges(dateToday),
    provisional_driving_privileges: getProvisionalDrivingPrivileges(dateToday),
    un_distinguishing_sign: "UK",
  };
}

export const getDrivingPrivileges = (issueDate: string) => [
  {
    vehicle_category_code: "AM",
    issue_date: issueDate,
    codes: [
      {
        code: "01",
      },
      {
        code: "02",
      },
    ],
  },
  {
    vehicle_category_code: "P",
    issue_date: issueDate,
    codes: [
      {
        code: "15",
      },
      {
        code: "20",
      },
      {
        code: "25",
      },
      {
        code: "30",
      },
    ],
  },
  {
    vehicle_category_code: "Q",
    issue_date: issueDate,
  },
  {
    vehicle_category_code: "A1",
    issue_date: issueDate,
  },
  {
    vehicle_category_code: "A2",
    issue_date: issueDate,
    codes: [
      {
        code: "44",
      },
      {
        code: "44(1)",
      },
      {
        code: "44(2)",
      },
    ],
  },
  {
    vehicle_category_code: "A",
    issue_date: issueDate,
    codes: [
      {
        code: "44(12)",
      },
      {
        code: "45",
      },
    ],
  },
  {
    vehicle_category_code: "B",
    issue_date: issueDate,
    codes: [
      {
        code: "45",
      },
    ],
  },
  {
    vehicle_category_code: "B auto",
    issue_date: issueDate,
  },
  {
    vehicle_category_code: "BE",
    issue_date: issueDate,
    codes: [
      {
        code: "71",
      },
    ],
  },
  {
    vehicle_category_code: "B1",
    issue_date: issueDate,
    codes: [
      {
        code: "96",
      },
      {
        code: "97",
      },
      {
        code: "101",
      },
      {
        code: "102",
      },
      {
        code: "103",
      },
    ],
  },
  {
    vehicle_category_code: "C1",
    issue_date: issueDate,
  },
  {
    vehicle_category_code: "C1E",
    issue_date: issueDate,
  },
  {
    vehicle_category_code: "C",
    issue_date: issueDate,
    codes: [
      {
        code: "79(3)",
      },
      {
        code: "96",
      },
      {
        code: "97",
      },
      {
        code: "101",
      },
      {
        code: "102",
      },
      {
        code: "103",
      },
      {
        code: "105",
      },
      {
        code: "106",
      },
      {
        code: "107",
      },
      {
        code: "108",
      },
      {
        code: "110",
      },
      {
        code: "111",
      },
    ],
  },
  {
    vehicle_category_code: "CE",
    issue_date: issueDate,
    codes: [
      {
        code: "01",
      },
      {
        code: "02",
      },
      {
        code: "10",
      },
      {
        code: "15",
      },
    ],
  },
  {
    vehicle_category_code: "D1",
    issue_date: issueDate,
  },
  {
    vehicle_category_code: "D1E",
    issue_date: issueDate,
    codes: [
      {
        code: "79",
      },
      {
        code: "79(2)",
      },
      {
        code: "79(3)",
      },
      {
        code: "96",
      },
      {
        code: "97",
      },
      {
        code: "101",
      },
      {
        code: "102",
      },
      {
        code: "103",
      },
      {
        code: "105",
      },
      {
        code: "106",
      },
      {
        code: "107",
      },
      {
        code: "108",
      },
      {
        code: "110",
      },
      {
        code: "111",
      },
      {
        code: "113",
      },
    ],
  },
  {
    vehicle_category_code: "D",
    issue_date: issueDate,
    codes: [
      {
        code: "01",
      },
    ],
  },
  {
    vehicle_category_code: "DE",
    issue_date: issueDate,
  },
  {
    vehicle_category_code: "F",
    issue_date: issueDate,
    codes: [
      {
        code: "01",
      },
      {
        code: "02",
      },
    ],
  },
  {
    vehicle_category_code: "G",
    issue_date: issueDate,
  },
  {
    vehicle_category_code: "H",
    issue_date: issueDate,
  },
  {
    vehicle_category_code: "K",
    issue_date: issueDate,
  },
  {
    vehicle_category_code: "L",
    issue_date: issueDate,
  },
  {
    vehicle_category_code: "M",
    issue_date: issueDate,
  },
  {
    vehicle_category_code: "N",
    issue_date: issueDate,
    codes: [
      {
        code: "01",
      },
      {
        code: "02",
      },
    ],
  },
];

export const getProvisionalDrivingPrivileges = (issueDate: string) => [
  {
    vehicle_category_code: "AM",
    issue_date: issueDate,
    codes: [
      {
        code: "01",
      },
      {
        code: "02",
      },
    ],
  },
];
