
import { initializeApp } from 'firebase/app';
import {
  getFirestore, collection, onSnapshot,
  addDoc, query, orderBy, where,
  getDocs,

} from 'firebase/firestore';
import {
  getAuth, signOut,
  GoogleAuthProvider, signInWithPopup, onAuthStateChanged

} from 'firebase/auth'




const firebaseConfig = {
  apiKey: "AIzaSyBeKGUZwCOGLll9faEktxJ33_L1gpauUV8",
  authDomain: "book-event-4e4c4.firebaseapp.com",
  projectId: "book-event-4e4c4",
  storageBucket: "book-event-4e4c4.appspot.com",
  messagingSenderId: "79063146007",
  appId: "1:79063146007:web:56c5ecfa7819ce889cc652"
};

// init firebase app
initializeApp(firebaseConfig);

// init firestore services 
const db = getFirestore();

// collection ref
const colRef = collection(db, 'booked');

// queries 
const q = query(colRef, orderBy('last_name'))

const auth = getAuth();


let totalSum = 0;

getDocs(colRef)
  .then((querySnapshot) => {
    querySnapshot.docs.forEach((doc) => {
      totalSum += parseInt(doc.data().num__of_people, 10);
    });
    console.log('Total sum:', totalSum);
  })
  .catch((error) => {
    console.log('Error getting documents:', error);
  });


const user = auth.currentUser;



function redirectToPage(pagename, delayInSeconds) {
  setTimeout(function () {
    window.location.href = pagename + '.html';
  }, delayInSeconds * 1000);
}



//LOGOUT 

//LOGIN

if (window.location.pathname.includes('signup.html')) {

  const gmailLogin = document.getElementById('gmailLogin');
  auth.onAuthStateChanged((user) => {
    if (user) {
      redirectToPage('booking', 0);
    } else {
      gmailLogin.addEventListener('click', (e) => {
        const provider = new GoogleAuthProvider();
        signInWithPopup(auth, provider)
          .then((result) => {
            console.log('user created: ', result.user)
            console.log(credential);

          }).catch((error) => {
            console.log("Error code : " + error.code);
            console.log("Error message : " + error.message);
            console.log("Error email : " + error.customData.email);
            console.log("Error AuthCredential: " + GoogleAuthProvider.credentialFromResult(error))
          })
      })
      console.log(user);



    }
  })
};



if (window.location.pathname.includes('index.html')) {
  const logOut = document.getElementById('signout');
  logOut.addEventListener('click', (e) => {
    signOut(auth).then(() => {
      console.log('user signed out');
      alert('You have been logged out');
    }).catch((error) => {
      console.log(error);
    })
  });

  // Toggle the visibility of the menu hamburger, X mark, and mobile menu
  const menuHamburger = document.getElementById("menu-hamburger");
  const xMark = document.getElementById("x-mark");
  menuHamburger.addEventListener("click", toggleMenuIcons);
  xMark.addEventListener("click", toggleMenuIcons);

  // Initially hide the X mark icon and mobile menu
  xMark.classList.add("hide");
  const mobileMenu = document.querySelector(".nav-links");

  function toggleMenuIcons() {
    const mobileMenu = document.querySelector(".nav-links");
    menuHamburger.classList.toggle("hide");
    xMark.classList.toggle("hide");
    mobileMenu.classList.toggle("mobile-menu");
  }

  window.addEventListener('scroll', reveal)
  function reveal() {
    var reveals = document.querySelectorAll('.reveal,.reveal2');

    for (var i = 0; i < reveals.length; i++) {
      var windowheight = window.innerHeight;
      var revealtop = reveals[i].getBoundingClientRect().top;
      var revealpoint = 300;
      if (revealtop < windowheight - revealpoint) {
        reveals[i].classList.add('active');
      } else {
        reveals[i].classList.remove('active')
      }

    }
  }



  /* */



  // carausel1
  const moveLeftBtn = document.getElementById('moveLeft');
  const moveRightBtn = document.getElementById('moveRight');
  const carouselItems = document.querySelectorAll('.carousel-item');
  let currentItem = 0;

  function moveRight() {
    carouselItems[currentItem].classList.remove('active3');
    currentItem = (currentItem + 1) % carouselItems.length;
    carouselItems[currentItem].classList.add('active3');
  }

  function moveLeft() {
    carouselItems[currentItem].classList.remove('active3');
    currentItem = (currentItem - 1 + carouselItems.length) % carouselItems.length;
    carouselItems[currentItem].classList.add('active3');
  }
  carouselItems[currentItem].classList.add('active3');

  moveLeftBtn.addEventListener('click', moveLeft);
  moveRightBtn.addEventListener('click', moveRight);

  const moveLeftBtn2 = document.getElementById('moveLeft2');
  const moveRightBtn2 = document.getElementById('moveRight2');
  const carouselItems2 = document.querySelectorAll('.carousel-item2');
  let currentItem2 = 0;

  function moveRight2() {
    carouselItems2[currentItem2].classList.remove('active2');
    currentItem2 = (currentItem2 + 1) % carouselItems2.length;
    carouselItems2[currentItem2].classList.add('active2');
  }

  function moveLeft2() {
    carouselItems2[currentItem2].classList.remove('active2');
    currentItem2 = (currentItem2 - 1 + carouselItems2.length) % carouselItems2.length;
    carouselItems2[currentItem2].classList.add('active2');
  }

  carouselItems2[currentItem2].classList.add('active2');

  moveLeftBtn2.addEventListener('click', moveLeft2);
  moveRightBtn2.addEventListener('click', moveRight2);



}



//booking
if (window.location.pathname.includes('booking.html')) {

  auth.onAuthStateChanged((user) => {
    if (user) {
      const addUserData = document.getElementById('add');
      const thankYou = document.getElementById('thank-you');
      console.log(user.email);
      addUserData.email.value = user.email;
      addUserData.email.setAttribute('readonly', 'readonly');


      addUserData.addEventListener('submit', (e) => {
        e.preventDefault();
        const currentNum = addUserData.elements.num_people.value;
        var recaptchaResponse = grecaptcha.getResponse();
        if (recaptchaResponse.length === 0) {
          alert("Please verify that you are human by completing the reCAPTCHA.");
        } else {
          const queryRef = query(colRef, where('email', '==', addUserData.email.value));
          getDocs(queryRef)
            .then((querySnapshot) => {
              if (!querySnapshot.empty) {
                alert('You have already booked for this event');
              } else {
                if (totalSum + currentNum >= 24) {
                  alert(`Sorry! We already reached the booking limit.\n
                  Only ${24 - totalSum} slots remain.\n


                  `)
                  addUserData.reset();

                } else {
                  addDoc(colRef, {
                    first_name: addUserData.fname.value,
                    last_name: addUserData.lname.value,
                    email: addUserData.email.value,
                    num__of_people: addUserData.num_people.value,
                    phone_number: addUserData.ph_number.value,
                    createdAt: Date()


                  })
                    .then(() => {
                      addUserData.classList.add('hidden');
                      thankYou.classList.remove('hidden');
                      redirectToPage('../index', 10);
                    })
                    .catch((error) => {
                      console.error('Error adding document: ', error);
                    });
                }
              }
            })
            .catch((error) => {
              console.log("Error getting documents: ", error);
            });
        }
      });
    } else {
      console.log('User is not logged in');
      alert('Not Logged In, cannot submit');
      redirectToPage('signup', 0);
    }
  });
}


// table

if (window.location.pathname.includes('table.html')) {
  const tableBody = document.querySelector('tbody');
  let booked = [];
  onSnapshot(q, (snapshot) => {
    snapshot.docs.forEach((doc) => {
      booked.push({ ...doc.data(), id: doc.id });
    });
    renderTableRows(booked);
  });


  //search input 
  const searchInput = document.getElementById('simple-search');
  searchInput.addEventListener("input", (e) => {
    const value = e.target.value.trim().toLowerCase();
    const filteredData = booked.filter(item =>
      item.first_name.toLowerCase().includes(value) ||
      item.last_name.toLowerCase().includes(value) ||
      item.email.toLowerCase().includes(value) ||
      item.phone_number.toLowerCase().includes(value)
    );
    renderTableRows(filteredData);
  });
  // Render table rows
  function renderTableRows(data) {
    // Clear previous table rows
    tableBody.innerHTML = '';

    // Iterate over the data and create table rows
    data.forEach((item) => {
      const row = document.createElement('tr');
      row.classList.add('border-b', 'dark:border-gray-700');

      // Create table cells

      const firstNameCell = document.createElement('td');
      firstNameCell.classList.add('px-4', 'py-3');
      firstNameCell.textContent = item.first_name;
      row.appendChild(firstNameCell);

      const lastNameCell = document.createElement('td');
      lastNameCell.classList.add('px-4', 'py-3');
      lastNameCell.textContent = item.last_name;
      row.appendChild(lastNameCell);

      const bookedCell = document.createElement('td');
      bookedCell.classList.add('px-4', 'py-3');
      bookedCell.textContent = item.num__of_people;
      row.appendChild(bookedCell);

      const emailCell = document.createElement('td');
      emailCell.classList.add('px-4', 'py-3');
      emailCell.textContent = item.email;
      row.appendChild(emailCell);

      const phoneCell = document.createElement('td');
      phoneCell.classList.add('px-4', 'py-3');
      phoneCell.textContent = item.phone_number;
      row.appendChild(phoneCell);

      const bookDate = document.createElement('td');
      bookDate.classList.add('px-4', 'py-3');
      bookDate.textContent = item.createdAt;
      row.appendChild(bookDate);


      // Append the row to the table body
      tableBody.appendChild(row);
    });
  }
}





