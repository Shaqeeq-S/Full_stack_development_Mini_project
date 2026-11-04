// Red Blood Cell (RBC) Compatibility Matrix
export const COMPATIBLE_DONORS_FOR_RECIPIENT = {
  'A+': ['A+', 'A-', 'O+', 'O-'],
  'A-': ['A-', 'O-'],
  'B+': ['B+', 'B-', 'O+', 'O-'],
  'B-': ['B-', 'O-'],
  'AB+': ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'], // Universal Recipient
  'AB-': ['AB-', 'A-', 'B-', 'O-'],
  'O+': ['O+', 'O-'],
  'O-': ['O-'], // Universal Donor gives to all, receives only O-
};

export const COMPATIBLE_RECIPIENTS_FOR_DONOR = {
  'O-': ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'],
  'O+': ['O+', 'A+', 'B+', 'AB+'],
  'B-': ['B-', 'B+', 'AB-', 'AB+'],
  'B+': ['B+', 'AB+'],
  'A-': ['A-', 'A+', 'AB-', 'AB+'],
  'A+': ['A+', 'AB+'],
  'AB-': ['AB-', 'AB+'],
  'AB+': ['AB+'],
};

export const ALL_BLOOD_GROUPS = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

export const getCompatibleDonors = (recipientBloodGroup) => {
  return COMPATIBLE_DONORS_FOR_RECIPIENT[recipientBloodGroup] || [recipientBloodGroup];
};

export const getCompatibleRecipients = (donorBloodGroup) => {
  return COMPATIBLE_RECIPIENTS_FOR_DONOR[donorBloodGroup] || [donorBloodGroup];
};

export const formatDate = (dateString) => {
  if (!dateString) return 'Not available';
  const d = new Date(dateString);
  return d.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
};

export const getPriorityBadgeClass = (priority) => {
  switch (priority) {
    case 'Emergency':
      return 'bg-red-100 text-red-700 border border-red-200 font-semibold';
    case 'Urgent':
      return 'bg-amber-100 text-amber-700 border border-amber-200 font-medium';
    case 'Normal':
    default:
      return 'bg-blue-100 text-blue-700 border border-blue-200 font-medium';
  }
};

export const getStatusBadgeClass = (status) => {
  switch (status) {
    case 'Fulfilled':
      return 'bg-emerald-100 text-emerald-800 border border-emerald-200';
    case 'Accepted':
      return 'bg-green-100 text-green-800 border border-green-200';
    case 'Donor Found':
      return 'bg-indigo-100 text-indigo-800 border border-indigo-200';
    case 'Pending':
      return 'bg-amber-100 text-amber-800 border border-amber-200';
    case 'Cancelled':
      return 'bg-slate-100 text-slate-600 border border-slate-200';
    default:
      return 'bg-gray-100 text-gray-700';
  }
};
