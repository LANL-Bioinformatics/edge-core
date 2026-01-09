import React, { useState, useEffect, useMemo, Fragment } from 'react'
import { Card, CardBody, Collapse, TabContent, TabPane, Nav, NavItem, NavLink } from 'reactstrap'
import { MaterialReactTable } from 'material-react-table'
import { ThemeProvider } from '@mui/material'
import { styled } from '@mui/material/styles'
import IconButton from '@mui/material/IconButton'
import InfoIcon from '@mui/icons-material/Info'
import { HtmlText } from 'src/edge/common/HtmlText'
import Tooltip, { tooltipClasses } from '@mui/material/Tooltip'
import { theme } from 'src/edge/um/common/tableUtil'
import { Header } from 'src/edge/project/results/CardHeader'
import config from 'src/config'

const NoMaxWidthTooltip = styled(({ className, ...props }) => (
  <Tooltip {...props} classes={{ popper: className }} />
))({
  [`& .${tooltipClasses.tooltip}`]: {
    maxWidth: 'none',
  },
})

export const Taxonomy = (props) => {
  const [view_info, setView_info] = useState(false)
  const [pathogen_info, setPathogen_info] = useState('')
  const [collapseCard, setCollapseCard] = useState(true)
  const tabs = {
    'Taxonomy/Pathogen': 'pathogen krona',
    Details: 'pathogen_full',
    Coverage: 'coverage_browser',
  }
  const [activeTab, setActiveTab] = useState(0)
  /* const tableData = props.result['GOTTCHA2 profiling result']
  //create columns from data
  const columns = useMemo(
    () =>
      tableData.length
        ? Object.keys(tableData[0]).map((columnId) => ({
            header: columnId,
            accessorKey: columnId,
            id: columnId,
          }))
        : [],
    [tableData],
  ) */
  const tableData2 = props.result['Pathogen-annotated hits']
  //create columns from data
  const columns2 = useMemo(
    () => [
      {
        header: 'LEVEL',
        accessorKey: 'LEVEL',
      },
      { header: 'NAME', accessorKey: 'NAME' },
      {
        header: 'TAXID',
        accessorKey: 'TAXID',
      },
      {
        header: 'READ_COUNT',
        accessorKey: 'READ_COUNT',
      },
      {
        header: 'TOTAL_BP_MAPPED',
        accessorKey: 'TOTAL_BP_MAPPED',
      },
      {
        header: 'SNI_SCORE',
        accessorKey: 'SNI_SCORE',
      },
      {
        header: 'COVERED_SIG_LEN',
        accessorKey: 'COVERED_SIG_LEN',
      },
      {
        header: 'BEST_SIG_COV',
        accessorKey: 'BEST_SIG_COV',
      },
      {
        header: 'DEPTH',
        accessorKey: 'DEPTH',
      },
      {
        header: 'REL_ABUNDANCE',
        accessorKey: 'REL_ABUNDANCE',
      },
      {
        header: 'PATHOGENIC_INFO',
        accessorKey: 'PATHOGENIC_INFO',
        Cell: ({ cell }) =>
          cell.getValue() == '' ? (
            ''
          ) : (
            <NoMaxWidthTooltip
              title={
                <HtmlText
                  text={cell.getValue().replace(/class="dataframe"/g, 'className="dataframe"')}
                />
              }
              placement="top"
              arrow
            >
              <IconButton size="small">
                <InfoIcon style={{ color: '#6a9e5d' }} />
              </IconButton>
            </NoMaxWidthTooltip>
          ),
      },
      {
        header: 'HUMAN_PATHOGEN',
        accessorKey: 'HUMAN_PATHOGEN',
      },
    ],
    [],
  )
  const toggleTab = (tab) => {
    setActiveTab(tab)
  }

  const viewInfo = (info) => () => {
    setPathogen_info(info)
    setView_info(true)
  }

  useEffect(() => {
    if (props.allExpand > 0) {
      setCollapseCard(false)
    }
  }, [props.allExpand])

  useEffect(() => {
    if (props.allClosed > 0) {
      setCollapseCard(true)
    }
  }, [props.allClosed])

  return (
    <Card className="workflow-result-card">
      <Header
        toggle={true}
        toggleParms={() => {
          setCollapseCard(!collapseCard)
        }}
        title={'Taxonomy Result'}
        collapseParms={collapseCard}
      />
      <Collapse isOpen={!collapseCard}>
        <CardBody>
          <Nav tabs>
            {Object.keys(tabs).map((item, index) => (
              <NavItem key={item + index}>
                <NavLink
                  style={{ cursor: 'pointer' }}
                  active={activeTab === index}
                  onClick={() => {
                    toggleTab(index)
                  }}
                >
                  {item}
                </NavLink>
              </NavItem>
            ))}
          </Nav>
          <TabContent activeTab={activeTab}>
            {Object.keys(tabs).map((item, index) => (
              <TabPane key={index} tabId={index}>
                <br></br>
                {item === 'Taxonomy/Pathogen' && tableData2 ? (
                  <>
                    <ThemeProvider theme={theme}>
                      <MaterialReactTable
                        columns={columns2}
                        data={tableData2}
                        enableFullScreenToggle={false}
                        muiTablePaginationProps={{
                          rowsPerPageOptions: [10, 20, 50, 100],
                          labelRowsPerPage: 'rows per page',
                        }}
                        renderEmptyRowsFallback={() => (
                          <center>
                            <br></br>No result to display
                          </center>
                        )}
                      />
                    </ThemeProvider>
                    <br></br>
                    <a
                      href={`${config.APP.API_URI}/projects/${props.project.code}/${props.result['Krona plot']}`}
                      target="_blank"
                      rel="noreferrer"
                    >
                      [full window view]
                    </a>
                    <br></br>
                    <br></br>
                    <iframe
                      id={'krona_iframe'}
                      key={'krona_iframe'}
                      src={`${config.APP.API_URI}/projects/${props.project.code}/${props.result['Krona plot']}`}
                      className="edge-iframe"
                    />
                  </>
                ) : item === 'Details' && props.result['Pathogen full'] ? (
                  <>
                    <a
                      href={`${config.APP.API_URI}/projects/${props.project.code}/${props.result['Pathogen full']}`}
                      target="_blank"
                      rel="noreferrer"
                    >
                      [full window view]
                    </a>
                    <br></br>
                    <br></br>
                    <iframe
                      id="pathogen_full_iframe"
                      key={'pathogen_full_iframe'}
                      src={`${config.APP.API_URI}/projects/${props.project.code}/${props.result['Pathogen full']}`}
                      className="edge-iframe"
                    />
                  </>
                ) : item === 'Coverage' && props.result['Coverage browser'] ? (
                  <>
                    <a
                      href={`${config.APP.API_URI}/projects/${props.project.code}/${props.result['Coverage browser']}`}
                      target="_blank"
                      rel="noreferrer"
                    >
                      [full window view]
                    </a>
                    <br></br>
                    <br></br>
                    <iframe
                      id="coverage_iframe"
                      key={'coverage_iframe'}
                      src={`${config.APP.API_URI}/projects/${props.project.code}/${props.result['Coverage browser']}`}
                      className="edge-iframe"
                    />
                  </>
                ) : (
                  <span>
                    No available
                    <br></br>
                    <br></br>
                  </span>
                )}
              </TabPane>
            ))}
          </TabContent>
          <br></br>
          <br></br>
        </CardBody>
      </Collapse>
    </Card>
  )
}
