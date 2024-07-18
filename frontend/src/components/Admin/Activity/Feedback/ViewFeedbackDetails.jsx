import React from 'react'
import { useLocation } from 'react-router-dom';
import { decryptData, encryptData } from '../../../../utils/encryptData';

function ViewFeedbackDetails() {
    
     const id =decryptData(new URLSearchParams(useLocation().search).get('feedbackId'))
     
console.log("here ids" ,id)
  return (
    <div>
      
    </div>
  )
}

export default ViewFeedbackDetails


