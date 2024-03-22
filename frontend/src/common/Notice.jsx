import { useState } from "react";
import './Notice.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faDownload } from '@fortawesome/free-solid-svg-icons';

export default function Notice () {
    const [ isLoading, setIsLoading ] = useState(false);
    const [ data, setData ] = useState(null);


    return(
        <div className="container">
            <h4 className="container-title">Notifications</h4>
            <div className="table-div">
                {/* <div className="buttons-section flex justify-end">
                    <div className="border rounded-lg text-white">
                        <button className="bg-green-600 p-1">
                            <FontAwesomeIcon icon={faPlus}/> Add New
                        </button>
                    </div>
                </div> */}
                <table className="table">
                    <thead>
                        <th className="w-2">Sl#</th>
                        <th className="w-16 whitespace-nowrap">Notification Date</th>
                        <th className="max-w-fit">Description</th>
                        <th className="w-2">Download</th>
                    </thead>
                    <tbody>
                        <tr>
                            <td>1</td>
                            <td>20/04/2023</td>
                            <td>Entry First Line 3</td>
                            <td className="text-center">
                                <button className="">
                                    <FontAwesomeIcon icon={faDownload} />
                                </button>
                            </td>
                        </tr>
                        <tr>
                            <td>1</td>
                            <td>20/04/2023</td>
                            <td>Entry First Line 3</td>
                            <td className="text-center">
                                <button className="">
                                    <FontAwesomeIcon icon={faDownload} />
                                </button>
                            </td>
                        </tr>
                        <tr>
                            <td>1</td>
                            <td>20/04/2023</td>
                            <td>Entry First Line 3</td>
                            <td className="text-center">
                                <button className="">
                                    <FontAwesomeIcon icon={faDownload} />
                                </button>
                            </td>
                        </tr>
                        <tr>
                            <td>1</td>
                            <td>20/04/2023</td>
                            <td>Entry First Line 3</td>
                            <td className="text-center">
                                <button className="">
                                    <FontAwesomeIcon icon={faDownload} />
                                </button>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    );
}