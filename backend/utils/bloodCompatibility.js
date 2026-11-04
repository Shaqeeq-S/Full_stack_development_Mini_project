// Red Blood Cell (RBC) Compatibility Matrix
// Key = Recipient Blood Group, Value = Compatible Donor Blood Groups
const COMPATIBLE_DONORS_FOR_RECIPIENT = {
  'A+': ['A+', 'A-', 'O+', 'O-'],
  'A-': ['A-', 'O-'],
  'B+': ['B+', 'B-', 'O+', 'O-'],
  'B-': ['B-', 'O-'],
  'AB+': ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'], // Universal Recipient
  'AB-': ['AB-', 'A-', 'B-', 'O-'],
  'O+': ['O+', 'O-'],
  'O-': ['O-'] // Universal Donor can give to all, receives only O-
};

// Key = Donor Blood Group, Value = Recipients who can receive this blood
const COMPATIBLE_RECIPIENTS_FOR_DONOR = {
  'O-': ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'], // Universal Donor
  'O+': ['O+', 'A+', 'B+', 'AB+'],
  'B-': ['B-', 'B+', 'AB-', 'AB+'],
  'B+': ['B+', 'AB+'],
  'A-': ['A-', 'A+', 'AB-', 'AB+'],
  'A+': ['A+', 'AB+'],
  'AB-': ['AB-', 'AB+'],
  'AB+': ['AB+'] // Only AB+
};

const getCompatibleDonors = (recipientBloodGroup) => {
  return COMPATIBLE_DONORS_FOR_RECIPIENT[recipientBloodGroup] || [recipientBloodGroup];
};

const getCompatibleRecipients = (donorBloodGroup) => {
  return COMPATIBLE_RECIPIENTS_FOR_DONOR[donorBloodGroup] || [donorBloodGroup];
};

const isCompatible = (donorBloodGroup, recipientBloodGroup) => {
  const allowed = COMPATIBLE_DONORS_FOR_RECIPIENT[recipientBloodGroup];
  return allowed ? allowed.includes(donorBloodGroup) : false;
};

module.exports = {
  COMPATIBLE_DONORS_FOR_RECIPIENT,
  COMPATIBLE_RECIPIENTS_FOR_DONOR,
  getCompatibleDonors,
  getCompatibleRecipients,
  isCompatible
};
