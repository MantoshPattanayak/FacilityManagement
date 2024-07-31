import React from 'react'
import PublicPrimaryHeader from './PublicPrimaryHeader'
import PublicHeader from './PublicHeader'

import "../common/PublicDoubbleHeader.css"


function PublicDoubbleHeader() {
  return (
    <div>
      <PublicPrimaryHeader/>
      <PublicHeader className="header-absolute" />
    </div>
  )
}

export default PublicDoubbleHeader
