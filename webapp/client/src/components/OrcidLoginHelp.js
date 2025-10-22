import React from 'react'
import { Card, CardBody, CardText, CardTitle } from 'reactstrap'

const OrcidLoginHelp = (props) => {
  return (
    <>
      <Card color="light" outline className="shadow bg-white rounded">
        <CardBody>
          <CardTitle className="edge-header-orcid-login-help-title" tag="h5">
            ORCID Account Integration
          </CardTitle>
          <CardText className="edge-header-orcid-login-help-text">
            EDGE requires an ORCID iD to log in. When logged in you have access to features such as
            uploading files and the ability to create and manage workflow runs.
            <br></br>
            <br></br>
            Click the &quot;ORCID Login&quot; button, to either register for an ORCID iD or, if you
            already have one, to sign into your ORCID account, then grant permission for EDGE to
            access your ORCID iD. This allows us to verify your identity and securely connect to
            your ORCID iD. Additionally, we may use information, such as your name and id, to
            associate your ORCID record with your EDGE workflow runs.
            <br></br>
            <br></br>
          </CardText>
        </CardBody>
      </Card>
    </>
  )
}

export default OrcidLoginHelp
