import {
    inputEnabled,
    setDiv,
    message,
    setToken,
    token,
    enableInput,
} from "./index.js";
import { showLoginRegister } from "./loginRegister.js";
import { showAddEdit } from "./addEdit.js";

let jobsDiv = null;
let jobsTable = null;
let jobsTableHeader = null;

export const handleJobs = () => {
    jobsDiv = document.getElementById("jobs");
    const logoff = document.getElementById("logoff");
    const addJob = document.getElementById("add-job");
    jobsTable = document.getElementById("jobs-table");
    jobsTableHeader = document.getElementById("jobs-table-header");
  
    jobsDiv.addEventListener("click", (e) => {
      if (inputEnabled) {
        if (e.target === addJob) {
          showAddEdit(null);
        } else if (e.target.classList.contains("editButton")) {
          message.textContent = "";
          showAddEdit(e.target.dataset.id);
        } else if (e.target.classList.contains("deleteButton")) {
          deleteJob(e.target.dataset.id);
        } else if (e.target === logoff) {
          setToken(null);
          message.textContent = "You have been logged off.";
          jobsTable.replaceChildren([jobsTableHeader]);
          showLoginRegister();
        }
      }
    });
  };
  

  export const showJobs = async () => {
    try {
      enableInput(false);
  
      const response = await fetch("/api/v1/jobs", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
  
      const data = await response.json();
      let children = [jobsTableHeader];
  
      if (response.status === 200) {
        if (data.count === 0) {
          jobsTable.replaceChildren(...children); // clear this for safety
        } else {
          data.jobs.forEach(job => {
            const rowEntry = document.createElement("tr");
  
            const editButton = `<button type="button" class="editButton" data-id="${job._id}">Edit</button>`;
            const deleteButton = `<button type="button" class="deleteButton" data-id="${job._id}">Delete</button>`;
            const rowHTML = `
              <td>${job.company}</td>
              <td>${job.position}</td>
              <td>${job.status}</td>
              <td>${editButton}</td>
              <td>${deleteButton}</td>
            `;
  
            rowEntry.innerHTML = rowHTML;
            children.push(rowEntry);
          });
  
          jobsTable.replaceChildren(...children);
        }
      } else {
        message.textContent = data.msg;
      }
    } catch (err) {
      console.log(err);
      message.textContent = "A communication error occurred.";
    }
  
    enableInput(true);
    setDiv(jobsDiv);
  };
  
  export const deleteJob = async (jobId) => {
    try {
      const response = await fetch(`/api/v1/jobs/${jobId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
  
      if (response.status === 200) {
        message.textContent = "The job entry was deleted.";
        showJobs();
      } else {
        const data = await response.json();
        message.textContent = data.msg;
      }
    } catch (err) {
      console.log(err);
      message.textContent = "A communication error occurred.";
    }
  };
  