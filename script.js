"use strict";

const jsonStudentList = `https://petlatkea.dk/2020/hogwarts/students.json`;
const jsonBloodStatus = `https://petlatkea.dk/2020/hogwarts/families.json`;

let allStudents = [];
const Student = {
  firstName: "",
  lastName: "",
  gender: "",
  house: "",
  image: "",
  expelled: false,
  prefect: false,
  bloodStatus: "",
  inqSquad: false,
  hacker: false,
};

let currentFilter = "*";
let currentSort = "firstname";
const expelledStudents = [];

window.addEventListener("load", start);

function start() {
  loadJSON();

  document.querySelector("#sorting").addEventListener("input", selectSort);

  document.querySelector("#filter").addEventListener("input", selectFilter);
}

async function loadJSON() {
  const response1 = await fetch(jsonStudentList);
  const response2 = await fetch(jsonBloodStatus);
  const jsonData1 = await response1.json();
  const jsonData2 = await response2.json();

  // when loaded, prepare data objects
  prepareObjects(jsonData1);
  assignBloodStatus(jsonData2);
  console.log(jsonData2);
}

function prepareObjects(jsonData) {
  allStudents = jsonData.map(preaperingbject);
  buildList();
  // displayList(allStudents);
}

function preaperingbject(jsonObject) {
  const student = Object.create(Student);

  const nameTrim = jsonObject.fullname.trim();
  const houseTrim = jsonObject.house.trim();

  const firstSpace = nameTrim.indexOf(" ");
  const lastSpace = nameTrim.lastIndexOf(" ");

  // Defining const for last name, first name and image

  const firstName = capitalize(nameTrim.substring(0, firstSpace));
  const lastName = capitalize(nameTrim.substring(lastSpace + 1));
  const image = lastName + "_" + firstName.substring(0, 1) + ".png";
  const house = capitalize(houseTrim);
  const gender = capitalize(jsonObject.gender);

  student.firstName = firstName;
  student.lastName = lastName;
  student.gender = jsonObject.gender;
  student.house = house;
  student.image = image;
  student.bloodStatus = "unknown";

  return student;
}

function assignBloodStatus(jsondata) {
  allStudents.forEach((student) => {
    if (jsondata.pure.includes(student.lastName)) {
      student.bloodStatus = "Pure";
    } else if (jsondata.half.includes(student.lastName)) {
      student.bloodStatus = "Half";
    } else {
      student.bloodStatus = "Muggleborn";
    }
  });
}

function selectFilter() {
  currentFilter = this.value;
  setFilter();
}

function selectSort() {
  currentSort = this.value;
  setSort();
}

function setSort() {
  buildList();
}

function setFilter() {
  buildList();
}

function buildList() {
  const currentList = filterList();
  const sortedList = sortList(currentList);
  displayList(sortedList);
}

function displayList(students) {
  document.querySelector("#student_table_content tbody").innerHTML = "";
  students.forEach(displayStudent);
}

function filterList() {
  if (currentFilter === "gryffindor") {
    const onlyGryffindoor = allStudents.filter(isGryffindoor);
    return onlyGryffindoor;
  } else if (currentFilter === "hufflepuff") {
    const onlyHufflepuff = allStudents.filter(isHufflepuff);
    return onlyHufflepuff;
  } else if (currentFilter === "ravenclaw") {
    const onlyRavenclaw = allStudents.filter(isRavenclaw);
    return onlyRavenclaw;
  } else if (currentFilter === "slytherin") {
    const onlySlytherin = allStudents.filter(isSlytherin);
    return onlySlytherin;
  } else {
    return allStudents;
  }
}

function isGryffindoor(student) {
  if (student.house === "Gryffindor") {
    return true;
  } else {
    return false;
  }
}
function isHufflepuff(student) {
  if (student.house === "Hufflepuff") {
    return true;
  } else {
    return false;
  }
}
function isRavenclaw(student) {
  if (student.house === "Ravenclaw") {
    return true;
  } else {
    return false;
  }
}
function isSlytherin(student) {
  if (student.house === "Slytherin") {
    return true;
  } else {
    return false;
  }
}

function sortList(currentList) {
  if (currentSort === "firstname") {
    const sortedList = currentList.sort(sortByFirstName);
    return sortedList;
  } else if (currentSort === "lastname") {
    const sortedList = currentList.sort(sortByLastName);
    return sortedList;
  } else if (currentSort === "house") {
    const sortedList = currentList.sort(sortByHouse);
    return sortedList;
  }
}

function sortByFirstName(a, b) {
  if (a.firstName < b.firstName) {
    return -1;
  } else {
    return 1;
  }
}
function sortByLastName(a, b) {
  if (a.lastName < b.lastName) {
    return -1;
  } else {
    return 1;
  }
}
function sortByHouse(a, b) {
  if (a.house < b.house) {
    return -1;
  } else {
    return 1;
  }
}

function capitalize(str) {
  const capitalized = str.substring(0, 1).toUpperCase() + str.substring(1).toLowerCase();
  return capitalized;
}

function displayStudent(student) {
  const clone = document.querySelector("template#student").content.cloneNode(true);

  clone.querySelector("[data-field=first_name]").textContent = student.firstName;
  clone.querySelector("[data-field=last_name]").textContent = student.lastName;
  clone.querySelector("[data-field=house]").textContent = student.house;
  clone.querySelector(".tr_student").addEventListener("click", () => showPopup(student));

  document.querySelector("#student_table_content tbody").appendChild(clone);
}

function showPopup(student) {
  const detail = document.querySelector("#detail");
  const buttonClose = document.querySelector(".close");
  const studentList = document.querySelector("#student_table_content");
  const studentListHeading = document.querySelector(".student_th");

  if (student.house === "Gryffindor") {
    detail.dataset.theme = "gryffindor";
  } else if (student.house === "Slytherin") {
    detail.dataset.theme = "slytherin";
  } else if (student.house === "Hufflepuff") {
    detail.dataset.theme = "hufflepuff";
  } else if (student.house === "Ravenclaw") {
    detail.dataset.theme = "ravenclaw";
  }

  detail.classList.remove("hide");
  studentList.classList.add("hide");
  studentListHeading.classList.add("hide");
  buttonClose.addEventListener("click", () => {
    detail.classList.add("hide");
    studentList.classList.remove("hide");
    studentListHeading.classList.remove("hide");
    document.querySelector(".expel").removeEventListener("click", addExpel);
    document.querySelector(".prefect_button").removeEventListener("click", addPrefect);
    document.querySelector(".squad_button").removeEventListener("click", addSquad);
  });
  document.querySelector("#detail .first_name").textContent = student.firstName;
  document.querySelector("#detail .last_name").textContent = student.lastName;
  document.querySelector("#detail .house").textContent = student.house;
  document.querySelector("#detail .blood_status").textContent = student.bloodStatus;
  document.querySelector("#detail .image").src = "/assets/" + student.image;
  document.querySelector(".expel").addEventListener("click", addExpel);
  document.querySelector(".prefect_button").addEventListener("click", addPrefect);
  document.querySelector(".squad_button").addEventListener("click", addSquad);

  if (student.prefect === true) {
    document.querySelector(".prefect_button").textContent = "Remove prefect";
    document.querySelector(".prefect").textContent = "Is prefect";
  } else {
    document.querySelector(".prefect_button").textContent = "Make prefect";
    document.querySelector(".prefect").textContent = "Is not prefect";
  }

  if (student.inqSquad === true) {
    document.querySelector(".squad_button").textContent = "Remove from squad";
    document.querySelector(".inq-squad").textContent = "Is a part of the Inquisitorial Squad";
  } else {
    document.querySelector(".squad_button").textContent = "Add to squad";
    document.querySelector(".inq-squad").textContent = "Is NOT a part of the Inquisitorial Squad";
  }

  function addExpel() {
    document.querySelector(".expel").removeEventListener("click", addExpel);
    if ((student.hacker = true)) {
      student.expelled = false;
    } else {
      student.expelled = true;
    }
    removeStudent(student);
  }

  function addPrefect() {
    document.querySelector(".prefect_button").removeEventListener("click", addPrefect);
    togglePrefect(student);
  }

  function addSquad() {
    document.querySelector(".squad_button").removeEventListener("click", addSquad);
    toggleSquad(student);
  }

  function removeStudent(student) {
    const index = allStudents.indexOf(student);

    allStudents.splice(index, 1);

    console.log(student);

    // student.push(expelledStudents);

    buildList();
  }
}

function togglePrefect(student) {
  if (student.prefect === true) {
    student.prefect = false;
  } else {
    student.prefect = true;
  }
  showPopup(student);
}

function toggleSquad(student) {
  if (student.inqSquad === true) {
    student.inqSquad = false;
  } else {
    student.inqSquad = true;
  }
  showPopup(student);
}

function hackTheSystem() {
  // Inject my self
  const myself = Object.create(Student);

  myself.firstName = "Markus";
  myself.hacker = true;

  buildList(myself);

  document.querySelector("main").textContent = "I UNFORTUNATELY HAVENT GOTTEN FAR ENOUGH TO HACK THE SYSTEM";
}

// function expel(student) {
//   if (student.hacker) {
//     // cannot be expelled
//   } else {
//     // Expel student
//   }
// }
