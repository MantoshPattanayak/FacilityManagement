import { React, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { decryptData, encryptData } from "../../../../utils/encryptData";
import axiosHttpClient from "../../../../utils/axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowLeftLong,
  faClose,
  faCloudUploadAlt,
} from "@fortawesome/free-solid-svg-icons";
import AdminHeader from "../../../../common/AdminHeader";
import { dataLength } from "../../../../utils/regexExpAndDataLength";
import { formatDate } from "../../../../utils/utilityFunctions";

function ViewFeedbackDetails() {
  const navigate = useNavigate();
  const id = parseInt(
    decryptData(new URLSearchParams(useLocation().search).get("feedbackId")),
    10
  );
  // id = parseInt(id, 10)

  const initialFormData = {
    name: "",
    emailId: "",
    phoneNo: "",
    subject: "",
    feedback: "",
    createdOn: "",
  };

  const [formData, setFormData] = useState(initialFormData);
  const [tableData, setTableData] = useState([]);

  async function fetchGrievanceDetails(givenReq = null) {
    try {
      let res = await axiosHttpClient("ADMIN_VIEW_FEEDBACK_LIST", "post", {
        givenReq,
      });
      console.log("here Respons of userData", res.data.data);
      if (Array.isArray(res.data.data)) {
        const sortedData = res.data.data.sort(
          (a, b) => new Date(b.createdOn) - new Date(a.createdOn)
        );
        setTableData(sortedData);
        // Find the specific feedback item by id
        const feedbackItem = sortedData.find((item) => item.feedbackId === id);

        console.log("shorted dta.........", feedbackItem);
        if (feedbackItem) {
          setFormData({
            name: feedbackItem.name,
            emailId: feedbackItem.email,
            phoneNo: feedbackItem.mobile,
            subject: feedbackItem.subject,
            feedback: feedbackItem.feedback,
            createdOn: feedbackItem.createdOn,
          });
          console.log("nameee", formData.name);
        } else {
          console.error("Feedback item not found:", id);
        }
      } else {
        console.error("Fetched data is not an array:", res.data.data);
      }
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    fetchGrievanceDetails();
  }, []);

  return (
    <div className="grievance-action">
      <AdminHeader />
      <div className="form-container">
        <div className="form-heading">
          <h2>View Feedback Details</h2>
          <div className="flex flex-col-reverse items-end w-[100%]">
            <button className="back-button" onClick={(e) => navigate(-1)}>
              <FontAwesomeIcon icon={faArrowLeftLong} /> Back
            </button>
          </div>
          <div className="grid lg:grid-rows-2 lg:grid-cols-2 md:grid-cols-2 sm:grid-cols-1 lg:gap-x-2 gap-y-4 w-[100%]">
            <div className="form-group col-span-1">
              <label htmlFor="input2">Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                maxLength={dataLength.NAME}
                disabled
              />
            </div>
            <div className="form-group col-span-1">
              <label htmlFor="input3">Phone Number</label>
              <input
                type="text"
                name="phoneNo"
                value={formData.phoneNo}
                maxLength={dataLength.PHONE_NUMBER}
                disabled
              />
            </div>
            <div className="form-group col-span-1">
              <label htmlFor="input1">Email ID</label>
              <input
                type="text"
                name="emailId"
                value={formData.emailId}
                maxLength={dataLength.EMAIL}
                disabled
              />
            </div>
            <div className="form-group col-span-1">
              <label htmlFor="input1">Subject</label>
              <input
                type="text"
                name="subject"
                value={formData.subject}
                maxLength={dataLength.STRING_VARCHAR_SHORT}
                disabled
              />
            </div>
            <div className="form-group col-span-2 w-full">
              <label htmlFor="input1">Details</label>
              <textarea
                type="text"
                name="feedback"
                className="w-full"
                rows={5}
                value={formData.feedback}
                maxLength={dataLength.STRING_VARCHAR_LONG}
                disabled
              />
            </div>
            <div className="form-group col-span-1">
              <label htmlFor="input1">Feedback Posted On</label>
              <input
                type="text"
                name="createdOn"
                value={formatDate(formData.createdOn)}
                maxLength={dataLength.STRING_VARCHAR_SHORT}
                disabled
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ViewFeedbackDetails;
