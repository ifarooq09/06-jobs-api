import { enableInput, inputEnabled, message, setDiv, token } from "./index.js";
import { showJobs } from "./jobs.js";

let addEditDiv = null;
let company = null;
let position = null;
let status = null;
let addingJob = null;

export const handleAddEdit = () => {
    addEditDiv = document.getElementById("edit-job");
    company = document.getElementById("company");
    position = document.getElementById("position");
    status = document.getElementById("status");
    addingJob = document.getElementById("adding-job");
    const editCancel = document.getElementById("edit-cancel");
  
    addingJob.addEventListener("click", async () => {
      if (inputEnabled) {
        enableInput(false);
  
        let method = "POST";
        let url = "/api/v1/jobs";
  
        if (addingJob.textContent.toLowerCase() === "update") {
          method = "PATCH";
          url = `/api/v1/jobs/${addEditDiv.dataset.id}`;
        }
  
        try {
          const response = await fetch(url, {
            method: method,
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              company: company.value,
              position: position.value,
              status: status.value,
            }),
          });
  
          const data = await response.json();
          if (response.status === 200 || response.status === 201) {
            message.textContent = method === "PATCH" ? "The job entry was updated." : "The job entry was created.";
            company.value = "";
            position.value = "";
            status.value = "pending";
            showJobs();
          } else {
            message.textContent = data.msg;
          }
        } catch (err) {
          console.log(err);
          message.textContent = "A communication error occurred.";
        }
        enableInput(true);
      }
    });
  
    editCancel.addEventListener("click", () => {
      message.textContent = "";
      showJobs();
    });
  };
  

  export const showAddEdit = async (jobId) => {
    if (!jobId) {
      company.value = "";
      position.value = "";
      status.value = "pending";
      addingJob.textContent = "Add";
      message.textContent = "";
  
      setDiv(addEditDiv);
    } else {
      enableInput(false);
  
      try {
        const response = await fetch(`/api/v1/jobs/${jobId}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
  
        const data = await response.json();
        if (response.status === 200) {
          company.value = data.job.company;
          position.value = data.job.position;
          status.value = data.job.status;
          addingJob.textContent = "Update";
          message.textContent = "";
          addEditDiv.dataset.id = jobId;
  
          setDiv(addEditDiv);
        } else {
          message.textContent = "The job entry was not found.";
          showJobs();
        }
      } catch (err) {
        console.log(err);
        message.textContent = "A communications error has occurred.";
        showJobs();
      }
  
      enableInput(true);
    }
  };
  