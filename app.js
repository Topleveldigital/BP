// Initialize Firebase
const firebaseConfig = {
  const firebaseConfig = {
    apiKey: "AIzaSyCUS2YjUuS5SfRzMylLmy-IG8KFY-G8ByY",
    authDomain: "bp-records-644a6.firebaseapp.com",
    projectId: "bp-records-644a6",
    storageBucket: "bp-records-644a6.appspot.com",
    messagingSenderId: "511939754014",
    appId: "1:511939754014:web:ad11c66818ae1a2aae560f",
    measurementId: "G-1QDFJ8C2LN"
  };
};
firebase.initializeApp(firebaseConfig);

// Get a reference to the database service
const database = firebase.database();

// Get form elements
const form = document.getElementById('bp-form');
const systolicInput = document.getElementById('systolic');
const diastolicInput = document.getElementById('diastolic');
const pulseInput = document.getElementById('pulse');
const noteInput = document.getElementById('note');
const showLast5Btn = document.getElementById('show-last-5');
const downloadDataBtn = document.getElementById('download-data');
const bpList = document.getElementById('bp-list');

// Add event listener for form submission
form.addEventListener('submit', (e) => {
  e.preventDefault();

  // Get current date and time
  const now = new Date();
  const date = now.toLocaleDateString();
  const time = now.toLocaleTimeString();

  // Get form values
  const systolic = systolicInput.value;
  const diastolic = diastolicInput.value;
  const pulse = pulseInput.value;
  const note = noteInput.value;

  // Create a new record in the database
  const newRecord = database.ref('records').push({
    date,
    time,
    systolic,
    diastolic,
    pulse,
    note
  });

  // Clear form inputs
  systolicInput.value = '';
  diastolicInput.value = '';
  pulseInput.value = '';
  noteInput.value = '';
});

// Add event listener for "Show Last 5 Records" button
showLast5Btn.addEventListener('click', () => {
  const recordsRef = database.ref('records').limitToLast(5);
  recordsRef.once('value', (snapshot) => {
    const records = snapshot.val();
    bpList.innerHTML = '';
    for (const recordId in records) {
      const record = records[recordId];
      const li = document.createElement('li');
      li.textContent = `Date: ${record.date}, Time: ${record.time}, Systolic: ${record.systolic}, Diastolic: ${record.diastolic}, Pulse: ${record.pulse}, Note: ${record.note}`;
      bpList.appendChild(li);
    }
  });
});

// Add event listener for "Download Data" button
downloadDataBtn.addEventListener('click', () => {
  const recordsRef = database.ref('records');
  recordsRef.once('value', (snapshot) => {
    const records = snapshot.val();
    const csvData = Object.values(records).map(record => `${record.date},${record.time},${record.systolic},${record.diastolic},${record.pulse},"${record.note}"`).join('\n');
    const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', 'blood_pressure_data.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  });
});