
import "./Emp_Attendance.css"
import AdminHeader from "../../../common/AdminHeader";
import { useState } from "react";
import axiosHttpClient from "../../../utils/axios";
import PublicLoader from "../../../common/PublicLoader";
const Emp_Attendance = () => {
    // useSate for set the data --------------
    const [UploadExcelData, setUploadExcelData] = useState("")
    // useSate for Show the error message -------
    const [errorMessage, setErrorMessage] = useState("");
    // useSate for Loader ---- by defult false 
    const[isLoading, setisLoading]=useState(false)
    // here Post the excel data  -----------------------------
    async function UploadExcel() {
        if (UploadExcelData === '') {
            setErrorMessage("Please upload a valid Excel file before submitting.");
            return;
        }
        setisLoading(true)
        try {
            let res = await axiosHttpClient("UPLOAD_STAFF_ATTENDANCE_API", "post", {
                dataUrl: UploadExcelData
            });
            console.log("Response of excel data", res);
            alert("Excel data uploaded successfully");
        } catch (err) {
            console.log("Error Response of Upload excel file", err);
            if (err.response && err.response.data && err.response.data.data) {
                const errorMessages = err.response.data.data
                    .map(error => `Row ${error.row}: ${error.message}`)
                    .join('\n');
                alert(`Errors found in the Excel file:\n\n${errorMessages}`);
                
            } else {
                alert("An unexpected error occurred. Please try again.");
            }
        }finally {
            setisLoading(false); // Hide loader
        }
    }
    // Handle Upload excel file  -----------------
    const handleChange = (e) => {
        const file = e.target.files[0]
        if (file) {
            const reander = new FileReader();
            console.log("here reader", reander)
            reander.onload = () => {
                const result = reander.result;
                if (result && result.trim().length > 0) {
                    setUploadExcelData(result)
                    setErrorMessage("");
                } else {
                    setErrorMessage("The file is empty. Please upload a file with data.");
                }
            }
            reander.readAsDataURL(file)  // convert the file in base64
        }
    }
    // Download  the csv formate -----------------------
    function ExportCsvFile() {
        try {
            // Define header
            const header = [
                "Sl No.",
                "EmpId",
                "FacilityCode",
                "Attendance Date",
                "Check In",
                "Check Out"
            ];
            // Create CSV content with only the header
            const csvContent = header.join(",") + "\n";
            // Create a Blob with CSV content and trigger download
            const blob = new Blob([csvContent], { type: "text/csv" });
            const link = document.createElement("a");
            link.href = URL.createObjectURL(blob);
            link.download = `EmployeeAttendanceSheet.csv`; // File name
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);

        } catch (error) {
            console.error("Error exporting CSV file:", error);
            alert("Failed to export CSV file. Please try again.");
        }
    }
    // here return method -----------------------
    return (
        <div className="container">
            <AdminHeader />
            <h1 className="title">Employee Attendance</h1>
            <h1>Download the csv file formate </h1>
            <div className="main_conatiner_of_Csv_file_download">
                <button className="Button_download_csv_file" onClick={ExportCsvFile}> Download Csv File</button>
            </div>
            <div className="upload-section">
                <h2 className="subtitle">Upload CSV File</h2>
                <input
                    type="file"
                    accept=".csv"
                    className="file-input"
                    onChange={handleChange}
                />
                {errorMessage && <p className="error-message">{errorMessage}</p>}
                <div className="Upload_Button_Mian_conatiner">
                  {isLoading && <PublicLoader />}
                    <button className="Upload_Button" onClick={UploadExcel}> Upload file</button>
                </div>
            </div>
        </div>
    )
}
export default Emp_Attendance;