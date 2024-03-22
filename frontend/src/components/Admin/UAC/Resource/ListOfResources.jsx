import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus } from '@fortawesome/free-solid-svg-icons'
import './ListOfResources.css';
import SearchIcon from '../../../../assets/search-icon.png'

export default function ListOfResources() {
  return (
    <div className='container'>
        <h4 className='container-title'>List of Resources</h4>
        <div className='table-div-resource'>
            <div className='table-div-resource-top'>
                <div className='table-div-resource-top-searchfilter'>
                    <div className="table-div-resource-top-searchfilter-entries">
                        <p className='searchfilter-text'>Show</p>
                        <select className='outline-none'>
                            <option selected>10</option>
                            <option>50</option>
                            <option>500</option>
                            <option>1000</option>
                        </select>
                        <p className='searchfilter-text'>entries</p>
                    </div>
                    <div className="table-div-resource-top-searchfilter-search">
                        <img src={SearchIcon} />
                        <input type='text' placeholder='Search' className='search-input'/>
                    </div>
                </div>
                <div className='addResource-btn'>
                    <button className='addResource text-right'>
                        <FontAwesomeIcon icon={faPlus} /> Add Resource
                    </button>
                </div>
            </div>
            <div className='table-section'>
                <table className='w-full'>
                    <thead className='relative'>
                        <th>Entry Header 1</th>
                        <th>Entry Header 2</th>
                        <th>Entry Header 3</th>
                        <th>Entry Header 4</th>
                    </thead>
                    <tbody className='table-tbody'>
                        <tr>
                            <td>Entry First Line 1</td>
                            <td>Entry First Line 2</td>
                            <td>Entry First Line 3</td>
                            <td>Entry First Line 4</td>
                        </tr>
                        <tr>
                            <td>Entry Line 1</td>
                            <td>Entry Line 2</td>
                            <td>Entry Line 3</td>
                            <td>Entry Line 4</td>
                        </tr>
                        <tr>
                            <td>Entry Last Line 1</td>
                            <td>Entry Last Line 2</td>
                            <td>Entry Last Line 3</td>
                            <td>Entry Last Line 4</td>
                        </tr>
                        <tr>
                            <td>Entry First Line 1</td>
                            <td>Entry First Line 2</td>
                            <td>Entry First Line 3</td>
                            <td>Entry First Line 4</td>
                        </tr>
                        <tr>
                            <td>Entry Line 1</td>
                            <td>Entry Line 2</td>
                            <td>Entry Line 3</td>
                            <td>Entry Line 4</td>
                        </tr>
                        <tr>
                            <td>Entry Last Line 1</td>
                            <td>Entry Last Line 2</td>
                            <td>Entry Last Line 3</td>
                            <td>Entry Last Line 4</td>
                        </tr>
                        <tr>
                            <td>Entry First Line 1</td>
                            <td>Entry First Line 2</td>
                            <td>Entry First Line 3</td>
                            <td>Entry First Line 4</td>
                        </tr>
                        <tr>
                            <td>Entry Line 1</td>
                            <td>Entry Line 2</td>
                            <td>Entry Line 3</td>
                            <td>Entry Line 4</td>
                        </tr>
                        <tr>
                            <td>Entry Last Line 1</td>
                            <td>Entry Last Line 2</td>
                            <td>Entry Last Line 3</td>
                            <td>Entry Last Line 4</td>
                        </tr>
                        <tr>
                            <td>Entry First Line 1</td>
                            <td>Entry First Line 2</td>
                            <td>Entry First Line 3</td>
                            <td>Entry First Line 4</td>
                        </tr>
                        <tr>
                            <td>Entry Line 1</td>
                            <td>Entry Line 2</td>
                            <td>Entry Line 3</td>
                            <td>Entry Line 4</td>
                        </tr>
                        <tr>
                            <td>Entry Last Line 1</td>
                            <td>Entry Last Line 2</td>
                            <td>Entry Last Line 3</td>
                            <td>Entry Last Line 4</td>
                        </tr>
                        <tr>
                            <td>Entry First Line 1</td>
                            <td>Entry First Line 2</td>
                            <td>Entry First Line 3</td>
                            <td>Entry First Line 4</td>
                        </tr>
                        <tr>
                            <td>Entry Line 1</td>
                            <td>Entry Line 2</td>
                            <td>Entry Line 3</td>
                            <td>Entry Line 4</td>
                        </tr>
                        <tr>
                            <td>Entry Last Line 1</td>
                            <td>Entry Last Line 2</td>
                            <td>Entry Last Line 3</td>
                            <td>Entry Last Line 4</td>
                        </tr>
                        <tr>
                            <td>Entry First Line 1</td>
                            <td>Entry First Line 2</td>
                            <td>Entry First Line 3</td>
                            <td>Entry First Line 4</td>
                        </tr>
                        <tr>
                            <td>Entry Line 1</td>
                            <td>Entry Line 2</td>
                            <td>Entry Line 3</td>
                            <td>Entry Line 4</td>
                        </tr>
                        <tr>
                            <td>Entry Last Line 1</td>
                            <td>Entry Last Line 2</td>
                            <td>Entry Last Line 3</td>
                            <td>Entry Last Line 4</td>
                        </tr>
                        <tr>
                            <td>Entry First Line 1</td>
                            <td>Entry First Line 2</td>
                            <td>Entry First Line 3</td>
                            <td>Entry First Line 4</td>
                        </tr>
                        <tr>
                            <td>Entry Line 1</td>
                            <td>Entry Line 2</td>
                            <td>Entry Line 3</td>
                            <td>Entry Line 4</td>
                        </tr>
                        <tr>
                            <td>Entry Last Line 1</td>
                            <td>Entry Last Line 2</td>
                            <td>Entry Last Line 3</td>
                            <td>Entry Last Line 4</td>
                        </tr>
                        <tr>
                            <td>Entry First Line 1</td>
                            <td>Entry First Line 2</td>
                            <td>Entry First Line 3</td>
                            <td>Entry First Line 4</td>
                        </tr>
                        <tr>
                            <td>Entry Line 1</td>
                            <td>Entry Line 2</td>
                            <td>Entry Line 3</td>
                            <td>Entry Line 4</td>
                        </tr>
                        <tr>
                            <td>Entry Last Line 1</td>
                            <td>Entry Last Line 2</td>
                            <td>Entry Last Line 3</td>
                            <td>Entry Last Line 4</td>
                        </tr>
                        <tr>
                            <td>Entry First Line 1</td>
                            <td>Entry First Line 2</td>
                            <td>Entry First Line 3</td>
                            <td>Entry First Line 4</td>
                        </tr>
                        <tr>
                            <td>Entry Line 1</td>
                            <td>Entry Line 2</td>
                            <td>Entry Line 3</td>
                            <td>Entry Line 4</td>
                        </tr>
                        <tr>
                            <td>Entry Last Line 1</td>
                            <td>Entry Last Line 2</td>
                            <td>Entry Last Line 3</td>
                            <td>Entry Last Line 4</td>
                        </tr>
                        <tr>
                            <td>Entry First Line 1</td>
                            <td>Entry First Line 2</td>
                            <td>Entry First Line 3</td>
                            <td>Entry First Line 4</td>
                        </tr>
                        <tr>
                            <td>Entry Line 1</td>
                            <td>Entry Line 2</td>
                            <td>Entry Line 3</td>
                            <td>Entry Line 4</td>
                        </tr>
                        <tr>
                            <td>Entry Last Line 1</td>
                            <td>Entry Last Line 2</td>
                            <td>Entry Last Line 3</td>
                            <td>Entry Last Line 4</td>
                        </tr>
                        <tr>
                            <td>Entry First Line 1</td>
                            <td>Entry First Line 2</td>
                            <td>Entry First Line 3</td>
                            <td>Entry First Line 4</td>
                        </tr>
                        <tr>
                            <td>Entry Line 1</td>
                            <td>Entry Line 2</td>
                            <td>Entry Line 3</td>
                            <td>Entry Line 4</td>
                        </tr>
                        <tr>
                            <td>Entry Last Line 1</td>
                            <td>Entry Last Line 2</td>
                            <td>Entry Last Line 3</td>
                            <td>Entry Last Line 4</td>
                        </tr>
                        <tr>
                            <td>Entry First Line 1</td>
                            <td>Entry First Line 2</td>
                            <td>Entry First Line 3</td>
                            <td>Entry First Line 4</td>
                        </tr>
                        <tr>
                            <td>Entry Line 1</td>
                            <td>Entry Line 2</td>
                            <td>Entry Line 3</td>
                            <td>Entry Line 4</td>
                        </tr>
                        <tr>
                            <td>Entry Last Line 1</td>
                            <td>Entry Last Line 2</td>
                            <td>Entry Last Line 3</td>
                            <td>Entry Last Line 4</td>
                        </tr>
                        <tr>
                            <td>Entry First Line 1</td>
                            <td>Entry First Line 2</td>
                            <td>Entry First Line 3</td>
                            <td>Entry First Line 4</td>
                        </tr>
                        <tr>
                            <td>Entry Line 1</td>
                            <td>Entry Line 2</td>
                            <td>Entry Line 3</td>
                            <td>Entry Line 4</td>
                        </tr>
                        <tr>
                            <td>Entry Last Line 1</td>
                            <td>Entry Last Line 2</td>
                            <td>Entry Last Line 3</td>
                            <td>Entry Last Line 4</td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <div className='pagination-bar'>

            </div>
        </div>
    </div>
  )
}
