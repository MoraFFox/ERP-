// Simple test for date formatting function
function formatDate(date) {
  if (!date) {
    return "N/A"
  }
  
  const dateObj = new Date(date)
  
  if (isNaN(dateObj.getTime())) {
    return "Invalid Date"
  }
  
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(dateObj)
}

// Test cases
console.log("Valid ISO date:", formatDate("2025-08-17T10:14:45.811Z"))
console.log("Null date:", formatDate(null))
console.log("Undefined date:", formatDate(undefined))
console.log("Empty string:", formatDate(""))
console.log("Invalid date:", formatDate("invalid-date"))
console.log("Valid date string:", formatDate("2025-08-17"))
