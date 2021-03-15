const PartyAllianceTable = (PartyAllianceTableData) => {
  console.log(PartyAllianceTableData)
  return (
    <div>
      <div className="widget-title">
        Parties and Alliances Election Constituencies Stats Summary
      </div>
      <div className="table-dim">
        <div className="table-head">
          <div className="w-1/5">Alliance/Party</div>
          <div className="w-4/5 md:flex">
            <div className="w-1/6 text-right">Contested In</div>
            <div className="w-1/6 text-right">Won</div>
            <div className="w-1/6 text-right">Gained</div>
            <div className="w-1/6 text-right">Retained</div>
            <div className="w-1/6 text-right">Lost</div>
          </div>
        </div>
        <div className="md:flex">
          <details>
            <summary>
              <div className="summary-head">
                  <div className="md:hidden">Alliance/Party: &nbsp;</div>
                  <div>NDA</div>
              </div>
              <div className="summary-head-param">
                <div className="w-1/6 text-right">90</div>
                <div className="w-1/6 text-right">80</div>
                <div className="w-1/6 text-right">11</div>
                <div className="w-1/6 text-right">69</div>
                <div className="w-1/6 text-right">5</div>
              </div>
            </summary>
            <div className="details-head">
              <div className="flex">
                <div className="w-2/3 font-bold">Contested In </div>
                <div className="w-1/3">90</div>
              </div>
              <div className="flex">
                <div className="w-2/3 font-bold">Won</div>
                <div className="w-1/3">80</div>
              </div>
              <div className="flex">
                <div className="w-2/3 font-bold">Gained</div>
                <div className="w-1/3">11</div>
              </div>
              <div className="flex">
                <div className="w-2/3 font-bold">Retained</div>
                <div className="w-1/3">69</div>
              </div>
              <div className="flex">
                <div className="w-2/3 font-bold">Lost</div>
                <div className="w-1/3">5</div>
              </div>
            </div>
            <div className="details-list">
              <div className="sub-summary md:pl-8">
                <div className="md:hidden">Party: &nbsp;</div>
                <div>BJP</div>
              </div>
              <div className="details-list-body">
                <div className="details-param md:w-1/6">
                  <div className="details-param-title">Contested In </div>
                  <div className="details-param-data">80</div>
                </div>
                <div className="details-param md:w-1/6">
                  <div className="details-param-title">Won</div>
                  <div className="details-param-data">70</div>
                </div>
                <div className="details-param md:w-1/6">
                  <div className="details-param-title">Gained</div>
                  <div className="details-param-data">36</div>
                </div>
                <div className="details-param md:w-1/6">
                  <div className="details-param-title">Retained</div>
                  <div className="details-param-data">60</div>
                </div>
                <div className="details-param md:w-1/6">
                  <div className="details-param-title">Lost</div>
                  <div className="details-param-data">8</div>
                </div>
              </div>
            </div>
            <div className="details-list">
              <div className="sub-summary md:pl-8">
                <div className="md:hidden">Party: &nbsp;</div>
                <div>ABC</div>
              </div>
              <div className="details-list-body">
                <div className="details-param md:w-1/6">
                  <div className="details-param-title">Contested In </div>
                  <div className="details-param-data">10</div>
                </div>
                <div className="details-param md:w-1/6">
                  <div className="details-param-title">Won</div>
                  <div className="details-param-data">6</div>
                </div>
                <div className="details-param md:w-1/6">
                  <div className="details-param-title">Gained</div>
                  <div className="details-param-data">2</div>
                </div>
                <div className="details-param md:w-1/6">
                  <div className="details-param-title">Retained</div>
                  <div className="details-param-data">4</div>
                </div>
                <div className="details-param md:w-1/6">
                  <div className="details-param-title">Lost</div>
                  <div className="details-param-data">5</div>
                </div>
              </div>
            </div>
            <div className="details-list">
              <div className="sub-summary md:pl-8">
                <div className="md:hidden">Party: &nbsp;</div>
                <div>DEF</div>
              </div>
              <div className="details-list-body">
                <div className="details-param md:w-1/6">
                  <div className="details-param-title">Contested In </div>
                  <div className="details-param-data">5</div>
                </div>
                <div className="details-param md:w-1/6">
                  <div className="details-param-title">Won</div>
                  <div className="details-param-data">3</div>
                </div>
                <div className="details-param md:w-1/6">
                  <div className="details-param-title">Gained</div>
                  <div className="details-param-data">3</div>
                </div>
                <div className="details-param md:w-1/6">
                  <div className="details-param-title">Retained</div>
                  <div className="details-param-data">0</div>
                </div>
                <div className="details-param md:w-1/6">
                  <div className="details-param-title">Lost</div>
                  <div className="details-param-data">0</div>
                </div>
              </div>
            </div>
          </details>
        </div>
        <div className="md:flex">
          <details>
            <summary>
              <div className="summary-head">
                  <div className="md:hidden">Alliance/Party: &nbsp;</div>
                  <div>INC</div>
              </div>
              <div className="summary-head-param">
                <div className="w-1/6 text-right">90</div>
                <div className="w-1/6 text-right">78</div>
                <div className="w-1/6 text-right">8</div>
                <div className="w-1/6 text-right">70</div>
                <div className="w-1/6 text-right">3</div>
              </div>
            </summary>
            <div className="details-head">
              <div className="flex">
                <div className="w-2/3 font-bold">Contested In </div>
                <div className="w-1/3">80</div>
              </div>
              <div className="flex">
                <div className="w-2/3 font-bold">Won</div>
                <div className="w-1/3">78</div>
              </div>
              <div className="flex">
                <div className="w-2/3 font-bold">Gained</div>
                <div className="w-1/3">8</div>
              </div>
              <div className="flex">
                <div className="w-2/3 font-bold">Retained</div>
                <div className="w-1/3">70</div>
              </div>
              <div className="flex">
                <div className="w-2/3 font-bold">Lost</div>
                <div className="w-1/3">3</div>
              </div>
            </div>
            <div className="details-list">
              <div className="sub-summary md:pl-8">
                <div className="md:hidden">Party: &nbsp;</div>
                <div>BJP</div>
              </div>
              <div className="details-list-body">
                <div className="details-param md:w-1/6">
                  <div className="details-param-title">Contested In </div>
                  <div className="details-param-data">80</div>
                </div>
                <div className="details-param md:w-1/6">
                  <div className="details-param-title">Won</div>
                  <div className="details-param-data">70</div>
                </div>
                <div className="details-param md:w-1/6">
                  <div className="details-param-title">Gained</div>
                  <div className="details-param-data">36</div>
                </div>
                <div className="details-param md:w-1/6">
                  <div className="details-param-title">Retained</div>
                  <div className="details-param-data">60</div>
                </div>
                <div className="details-param md:w-1/6">
                  <div className="details-param-title">Lost</div>
                  <div className="details-param-data">8</div>
                </div>
              </div>
            </div>
            <div className="details-list">
              <div className="sub-summary md:pl-8">
                <div className="md:hidden">Party: &nbsp;</div>
                <div>ABC</div>
              </div>
              <div className="details-list-body">
                <div className="details-param md:w-1/6">
                  <div className="details-param-title">Contested In </div>
                  <div className="details-param-data">10</div>
                </div>
                <div className="details-param md:w-1/6">
                  <div className="details-param-title">Won</div>
                  <div className="details-param-data">6</div>
                </div>
                <div className="details-param md:w-1/6">
                  <div className="details-param-title">Gained</div>
                  <div className="details-param-data">2</div>
                </div>
                <div className="details-param md:w-1/6">
                  <div className="details-param-title">Retained</div>
                  <div className="details-param-data">4</div>
                </div>
                <div className="details-param md:w-1/6">
                  <div className="details-param-title">Lost</div>
                  <div className="details-param-data">5</div>
                </div>
              </div>
            </div>
            <div className="details-list">
              <div className="sub-summary md:pl-8">
                <div className="md:hidden">Party: &nbsp;</div>
                <div>DEF</div>
              </div>
              <div className="details-list-body">
                <div className="details-param md:w-1/6">
                  <div className="details-param-title">Contested In </div>
                  <div className="details-param-data">5</div>
                </div>
                <div className="details-param md:w-1/6">
                  <div className="details-param-title">Won</div>
                  <div className="details-param-data">3</div>
                </div>
                <div className="details-param md:w-1/6">
                  <div className="details-param-title">Gained</div>
                  <div className="details-param-data">3</div>
                </div>
                <div className="details-param md:w-1/6">
                  <div className="details-param-title">Retained</div>
                  <div className="details-param-data">0</div>
                </div>
                <div className="details-param md:w-1/6">
                  <div className="details-param-title">Lost</div>
                  <div className="details-param-data">0</div>
                </div>
              </div>
            </div>
          </details>
        </div>
        <div className="md:flex">
          <details>
            <summary>
              <div className="summary-head">
                  <div className="md:hidden">Alliance/Party: &nbsp;</div>
                  <div>CDE</div>
              </div>
              <div className="summary-head-param">
                <div className="w-1/6 text-right">46</div>
                <div className="w-1/6 text-right">38</div>
                <div className="w-1/6 text-right">13</div>
                <div className="w-1/6 text-right">25</div>
                <div className="w-1/6 text-right">2</div>
              </div>
            </summary>
            <div className="details-head">
              <div className="flex">
                <div className="w-2/3 font-bold">Contested In </div>
                <div className="w-1/3">46</div>
              </div>
              <div className="flex">
                <div className="w-2/3 font-bold">Won</div>
                <div className="w-1/3">38</div>
              </div>
              <div className="flex">
                <div className="w-2/3 font-bold">Gained</div>
                <div className="w-1/3">13</div>
              </div>
              <div className="flex">
                <div className="w-2/3 font-bold">Retained</div>
                <div className="w-1/3">25</div>
              </div>
              <div className="flex">
                <div className="w-2/3 font-bold">Lost</div>
                <div className="w-1/3">2</div>
              </div>
            </div>
            <div className="details-list">
              <div className="sub-summary md:pl-8">
                <div className="md:hidden">Party: &nbsp;</div>
                <div>KLM</div>
              </div>
              <div className="details-list-body">
                <div className="details-param md:w-1/6">
                  <div className="details-param-title">Contested In </div>
                  <div className="details-param-data">24</div>
                </div>
                <div className="details-param md:w-1/6">
                  <div className="details-param-title">Won</div>
                  <div className="details-param-data">22</div>
                </div>
                <div className="details-param md:w-1/6">
                  <div className="details-param-title">Gained</div>
                  <div className="details-param-data">2</div>
                </div>
                <div className="details-param md:w-1/6">
                  <div className="details-param-title">Retained</div>
                  <div className="details-param-data">20</div>
                </div>
                <div className="details-param md:w-1/6">
                  <div className="details-param-title">Lost</div>
                  <div className="details-param-data">4</div>
                </div>
              </div>
            </div>
            <div className="details-list">
              <div className="sub-summary md:pl-8">
                <div className="md:hidden">Party: &nbsp;</div>
                <div>ABC</div>
              </div>
              <div className="details-list-body">
                <div className="details-param md:w-1/6">
                  <div className="details-param-title">Contested In </div>
                  <div className="details-param-data">10</div>
                </div>
                <div className="details-param md:w-1/6">
                  <div className="details-param-title">Won</div>
                  <div className="details-param-data">6</div>
                </div>
                <div className="details-param md:w-1/6">
                  <div className="details-param-title">Gained</div>
                  <div className="details-param-data">2</div>
                </div>
                <div className="details-param md:w-1/6">
                  <div className="details-param-title">Retained</div>
                  <div className="details-param-data">4</div>
                </div>
                <div className="details-param md:w-1/6">
                  <div className="details-param-title">Lost</div>
                  <div className="details-param-data">5</div>
                </div>
              </div>
            </div>
            <div className="details-list">
              <div className="sub-summary md:pl-8">
                <div className="md:hidden">Party: &nbsp;</div>
                <div>DEF</div>
              </div>
              <div className="details-list-body">
                <div className="details-param md:w-1/6">
                  <div className="details-param-title">Contested In </div>
                  <div className="details-param-data">5</div>
                </div>
                <div className="details-param md:w-1/6">
                  <div className="details-param-title">Won</div>
                  <div className="details-param-data">3</div>
                </div>
                <div className="details-param md:w-1/6">
                  <div className="details-param-title">Gained</div>
                  <div className="details-param-data">3</div>
                </div>
                <div className="details-param md:w-1/6">
                  <div className="details-param-title">Retained</div>
                  <div className="details-param-data">0</div>
                </div>
                <div className="details-param md:w-1/6">
                  <div className="details-param-title">Lost</div>
                  <div className="details-param-data">0</div>
                </div>
              </div>
            </div>
          </details>
        </div>
        <div className="md:flex">
          <details>
            <summary>
              <div className="summary-head">
                  <div className="md:hidden">Alliance/Party: &nbsp;</div>
                  <div>Others</div>
              </div>
              <div className="summary-head-param">
                <div className="w-1/6 text-right">90</div>
                <div className="w-1/6 text-right">80</div>
                <div className="w-1/6 text-right">11</div>
                <div className="w-1/6 text-right">69</div>
                <div className="w-1/6 text-right">5</div>
              </div>
            </summary>
            <div className="details-head">
              <div className="flex">
                <div className="w-2/3 font-bold">Contested In </div>
                <div className="w-1/3">90</div>
              </div>
              <div className="flex">
                <div className="w-2/3 font-bold">Won</div>
                <div className="w-1/3">80</div>
              </div>
              <div className="flex">
                <div className="w-2/3 font-bold">Gained</div>
                <div className="w-1/3">11</div>
              </div>
              <div className="flex">
                <div className="w-2/3 font-bold">Retained</div>
                <div className="w-1/3">69</div>
              </div>
              <div className="flex">
                <div className="w-2/3 font-bold">Lost</div>
                <div className="w-1/3">5</div>
              </div>
            </div>
            <div className="details-list">
              <div className="sub-summary md:pl-8">
                <div className="md:hidden">Party: &nbsp;</div>
                <div>BJP</div>
              </div>
              <div className="details-list-body">
                <div className="details-param md:w-1/6">
                  <div className="details-param-title">Contested In </div>
                  <div className="details-param-data">80</div>
                </div>
                <div className="details-param md:w-1/6">
                  <div className="details-param-title">Won</div>
                  <div className="details-param-data">70</div>
                </div>
                <div className="details-param md:w-1/6">
                  <div className="details-param-title">Gained</div>
                  <div className="details-param-data">36</div>
                </div>
                <div className="details-param md:w-1/6">
                  <div className="details-param-title">Retained</div>
                  <div className="details-param-data">60</div>
                </div>
                <div className="details-param md:w-1/6">
                  <div className="details-param-title">Lost</div>
                  <div className="details-param-data">8</div>
                </div>
              </div>
            </div>
            <div className="details-list">
              <div className="sub-summary md:pl-8">
                <div className="md:hidden">Party: &nbsp;</div>
                <div>ABC</div>
              </div>
              <div className="details-list-body">
                <div className="details-param md:w-1/6">
                  <div className="details-param-title">Contested In </div>
                  <div className="details-param-data">10</div>
                </div>
                <div className="details-param md:w-1/6">
                  <div className="details-param-title">Won</div>
                  <div className="details-param-data">6</div>
                </div>
                <div className="details-param md:w-1/6">
                  <div className="details-param-title">Gained</div>
                  <div className="details-param-data">2</div>
                </div>
                <div className="details-param md:w-1/6">
                  <div className="details-param-title">Retained</div>
                  <div className="details-param-data">4</div>
                </div>
                <div className="details-param md:w-1/6">
                  <div className="details-param-title">Lost</div>
                  <div className="details-param-data">5</div>
                </div>
              </div>
            </div>
            <div className="details-list">
              <div className="sub-summary md:pl-8">
                <div className="md:hidden">Party: &nbsp;</div>
                <div>DEF</div>
              </div>
              <div className="details-list-body">
                <div className="details-param md:w-1/6">
                  <div className="details-param-title">Contested In </div>
                  <div className="details-param-data">5</div>
                </div>
                <div className="details-param md:w-1/6">
                  <div className="details-param-title">Won</div>
                  <div className="details-param-data">3</div>
                </div>
                <div className="details-param md:w-1/6">
                  <div className="details-param-title">Gained</div>
                  <div className="details-param-data">3</div>
                </div>
                <div className="details-param md:w-1/6">
                  <div className="details-param-title">Retained</div>
                  <div className="details-param-data">0</div>
                </div>
                <div className="details-param md:w-1/6">
                  <div className="details-param-title">Lost</div>
                  <div className="details-param-data">0</div>
                </div>
              </div>
            </div>
          </details>
        </div>
      </div>
    </div>
  )
}

export default PartyAllianceTable
