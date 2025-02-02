import "bootstrap/dist/css/bootstrap.min.css";
import './Dashboard.css';
import OrgCard from './OrgCard';
import { useState,useEffect } from "react";
import Navbar from '../../components/Navbar/Navbar';
import Dropdown from 'react-bootstrap/Dropdown';
import { fetchOrgData, fetchUserBookmarks, fetchUserData } from "../../components/FirebaseConnection";
import Sidebar from "../../components/Sidebar/Sidebar";
import { getAuth, onAuthStateChanged } from "firebase/auth";

export default function DashboardPage() {

  const [orgs, setOrgs] = useState([]);
  const [userBookmarks, setUserBookmarks] = useState([]);

  const [query, setQuery] = useState('');
  const [sortOrder, setSortOrder] = useState('asc');
  const [sortFilterActive, setSortFilterActive] = useState(true);
  const [starredFilterActive, setStarredFilterActive] = useState(false);
  const [openForAppFilterActive, setOpenForAppFilterActive] = useState(false);
  const [scopeActive, setScopeActive] = useState(false);
  const [tagActive, setTagActive] = useState(false);

  const [selectedScope, setSelectedScope] = useState(null);
  const [selectedTags, setSelectedTags] = useState([]);

  const [databaseConnected, setDatabaseConnected] = useState(false);

  const [uid, setUid] = useState("-1");

  useEffect(() => {
    const auth = getAuth();

    onAuthStateChanged(auth, (user) => {
        if (user) {
            if (auth.currentUser?.isAnonymous) {
            } else {
                setUid(user.uid);
            }
        } else {
            setUid("-1");
        }
    })
  }, [uid]);


  useEffect(() => {
    setOrgs([]); // Clear existing data before fetching new data
    fetchUserBookmarks(uid)
      .then(bookmarks => {
        console.log(bookmarks);
        setUserBookmarks(bookmarks);
      })
    fetchOrgData()
      .then(data => {
        const newData = data.map(item => ({ ...item, starred: userBookmarks[item.id], id: item.id })); // Add 'starred: false' property to each object
        setOrgs(newData);
        console.log(newData)
        setDatabaseConnected(true);
      })
      .catch(error => {
        setDatabaseConnected(false);
        console.error(error);
      });
  }, []);
  
  const toggleStarred = (id) => {
    setOrgs(orgs.map(org => org.orgId === id ? { ...org, starred: !org.starred } : org));
  };

const filteredOrgs = orgs.filter(org =>
  (!starredFilterActive || org.starred) &&
  (org.orgName.toLowerCase().includes(query.toLowerCase()) ||
    org.orgDescription.toLowerCase().includes(query.toLowerCase())) &&
    (!selectedScope || org.orgTags.includes(selectedScope)) &&
    (selectedTags.length === 0 || selectedTags.every(tag => org.orgTags.includes(tag)))
);

  const sortedOrgs = [...filteredOrgs].sort((a, b) => {
    if (sortOrder === 'asc') {
      return a.orgName.localeCompare(b.orgName);
    } else {
      return b.orgName.localeCompare(a.orgName);
    }
  });

  const toggleSortOrder = () => {
    setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    setSortFilterActive(!sortFilterActive);
  };

  const toggleStarredFilter = () => {
    setStarredFilterActive(!starredFilterActive);
  };

  const toggleOpenForAppFilter = () => {
    setOpenForAppFilterActive(!openForAppFilterActive);
  };

  const handleScopeSelect = (scope) => {
    setSelectedScope(prevScope => prevScope === scope ? null : scope);
    setScopeActive(!scopeActive);
  };

  const handleTagSelect = (tag) => {
    let updatedTags = [];
    let updatedTagActive = false;
  
    // Update the class name synchronously before updating the state
    if (selectedTags.includes(tag)) {
      updatedTags = selectedTags.filter(t => t !== tag);
    } else {
      updatedTags = [...selectedTags, tag];
    }
  
    // Check if there are any tags selected
    if (updatedTags.length > 0) {
      updatedTagActive = true;
    }
  
    // Update state
    setSelectedTags(updatedTags);
    setTagActive(updatedTagActive);
  };
  
  

  return (
    <div className="background-container"> 
      <Navbar currentPage={"dashboard"}/>
      <Sidebar orgs={sortedOrgs} toggleStarred={toggleStarred} />
      <div className="header-container">
      <div className="container-md">
      <div className="main-text"> What Org You Looking For?</div>
      <div className="sub-text"> Type in keywords, or use tags to filter out the results.</div>
        <div className="row search-row">
          <div className="col-2"></div>
          <div className="col-7">
            <input
              type="search"
              className="form-control search-bar"
              placeholder="Type to Search"
              value={query}
              onChange={e => setQuery(e.target.value)}
            />
          </div>
          <div className="col-1">
            <button className={`sort-btn ${sortFilterActive ? 'active' : ''}`} type="submit" onClick={toggleSortOrder}>
              <svg xmlns="http://www.w3.org/2000/svg" width="38" height="45" fill="currentColor" className="bi bi-sort-alpha-up" viewBox="0 0 16 16">
                <path fill-rule="evenodd" d="M10.082 5.629 9.664 7H8.598l1.789-5.332h1.234L13.402 7h-1.12l-.419-1.371zm1.57-.785L11 2.687h-.047l-.652 2.157z"/>
                <path d="M12.96 14H9.028v-.691l2.579-3.72v-.054H9.098v-.867h3.785v.691l-2.567 3.72v.054h2.645zm-8.46-.5a.5.5 0 0 1-1 0V3.707L2.354 4.854a.5.5 0 1 1-.708-.708l2-1.999.007-.007a.5.5 0 0 1 .7.006l2 2a.5.5 0 1 1-.707.708L4.5 3.707z"/>
              </svg>
            </button>
          </div>
          <div className="col-2"></div>
        </div>

        <div className="row search-filters-row align-items-center justify-content-md-center">
          <button type="button" className={`filter-btn ${starredFilterActive ? 'active' : ''}`} onClick={toggleStarredFilter}> Starred </button>
          <button type="button" className={`filter-btn ${openForAppFilterActive ? 'active' : ''}`} onClick={toggleOpenForAppFilter}> Open for Applications </button>
          <div className="col-md-auto">
            <Dropdown>
              <Dropdown.Toggle className={`dropdown-btn ${scopeActive ? 'active' : ''}`} variant="secondary" id="dropdown-basic">
                Scope
              </Dropdown.Toggle>
              <Dropdown.Menu>
                  {/* Scope dropdown items */}
                  <Dropdown.Item className={selectedScope === "computer science" ? "selected-scope" : ""} 
                  onClick={() => handleScopeSelect("computer science")}>
                      Computer Science</Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </div>
          <div className="col-md-auto">
            <Dropdown>
              <Dropdown.Toggle className={`dropdown-btn ${tagActive ? 'active' : ''}`} variant="secondary" id="dropdown-basic">
                More Tags
              </Dropdown.Toggle>
              <Dropdown.Menu>
                  {/* More Tags dropdown items */}
                  <Dropdown.Item className={selectedTags.includes("academic") ? "selected-scope" : ""} 
                  onClick={(e) => { e.stopPropagation(); handleTagSelect("academic"); }}>
                      Academic </Dropdown.Item>
                  <Dropdown.Item className={selectedTags.includes("socio-academic") ? "selected-scope" : ""} 
                  onClick={(e) => { e.stopPropagation(); handleTagSelect("socio-academic"); }}>
                      Socio-Academic </Dropdown.Item>
                  <Dropdown.Item className={selectedTags.includes("non-sectarian") ? "selected-scope" : ""} 
                  onClick={(e) => { e.stopPropagation(); handleTagSelect("non-sectarian"); }}>
                      Non-Sectarian </Dropdown.Item> 
                  <Dropdown.Item className={selectedTags.includes("non-profit") ? "selected-scope" : ""} 
                  onClick={(e) => { e.stopPropagation(); handleTagSelect("non-profit"); }}>
                      Non-Profit </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </div>
        </div>
      </div>
      </div>

      <div className="container-md results-container">
        {!databaseConnected ? (
          <div className="no-results">
            <svg width="304" height="300" viewBox="0 0 304 300" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="152" cy="138.054" r="105.242" fill="#FFF8EA"/>
            <circle cx="152" cy="138.054" r="82.2581" fill="#F9E6CB"/>
            <path d="M148.918 241.807C139.256 251.683 125.779 257.812 110.871 257.812C93.0764 257.812 77.3215 249.08 67.6574 235.667C62.8869 248.595 50.4554 257.812 35.871 257.812C17.1646 257.812 2 242.648 2 223.941C2 205.235 17.1646 190.071 35.871 190.071C44.3352 190.071 52.0744 193.175 58.0116 198.308C61.1183 171.871 83.5994 151.361 110.871 151.361C129.246 151.361 145.446 160.672 155.01 174.833C162.974 168.471 173.071 164.667 184.056 164.667C204.326 164.667 221.572 177.617 227.971 195.694C232.85 192.886 238.508 191.28 244.54 191.28C262.251 191.28 276.729 205.12 277.749 222.575C279.657 221.893 281.713 221.522 283.855 221.522C293.876 221.522 302 229.646 302 239.667C302 249.689 293.876 257.812 283.855 257.812C276.943 257.812 270.933 253.948 267.87 248.261C261.866 254.168 253.629 257.812 244.54 257.812C233.329 257.812 223.413 252.267 217.387 243.768C208.929 252.433 197.121 257.812 184.056 257.812C170.033 257.812 157.457 251.614 148.918 241.807Z" fill="white"/>
            <path d="M2 223.941C2 205.235 17.1646 190.071 35.871 190.071C44.3352 190.071 52.0744 193.175 58.0116 198.308C61.1183 171.871 83.5994 151.361 110.871 151.361C129.246 151.361 145.446 160.672 155.01 174.833C162.974 168.471 173.071 164.667 184.056 164.667C204.326 164.667 221.572 177.617 227.971 195.694C232.85 192.886 238.508 191.28 244.54 191.28C262.251 191.28 276.729 205.12 277.749 222.575C279.657 221.893 281.713 221.522 283.855 221.522C293.876 221.522 302 229.646 302 239.667" stroke="#9D7045" stroke-width="2.06618" stroke-linecap="round"/>
            <path d="M205.421 238.867C205.893 239.34 206.659 239.34 207.131 238.867L213.339 232.66C213.36 232.638 213.394 232.582 213.431 232.509C213.614 232.157 213.693 231.755 213.693 231.359L213.693 86.0383L91.516 86.0382L91.5159 230.754L91.5159 231.359C91.5159 231.964 91.7957 232.583 91.8723 232.66L98.08 238.867C98.5524 239.34 99.3184 239.34 99.7908 238.867L105.644 233.014L111.498 238.867C111.97 239.34 112.736 239.34 113.208 238.867L119.062 233.014L124.915 238.867C125.388 239.34 126.154 239.34 126.626 238.867L132.479 233.014L138.333 238.867C138.805 239.34 139.571 239.34 140.043 238.867L145.897 233.014L151.75 238.867C152.223 239.34 152.989 239.34 153.461 238.867L159.314 233.014L165.168 238.867C165.64 239.34 166.406 239.34 166.879 238.867L172.732 233.014L178.585 238.867C179.058 239.34 179.824 239.34 180.296 238.867L186.15 233.014L192.003 238.867C192.475 239.34 193.241 239.34 193.714 238.867L199.567 233.014L205.421 238.867Z" fill="#F7EDE3" stroke="#42230C" stroke-width="1.54963"/>
            <path fill-rule="evenodd" clip-rule="evenodd" d="M136.274 156.2C138.947 156.2 141.113 154.033 141.113 151.361C141.113 148.689 138.947 146.522 136.274 146.522C133.602 146.522 131.436 148.689 131.436 151.361C131.436 154.033 133.602 156.2 136.274 156.2ZM168.936 156.2C171.608 156.2 173.774 154.033 173.774 151.361C173.774 148.689 171.608 146.522 168.936 146.522C166.263 146.522 164.097 148.689 164.097 151.361C164.097 154.033 166.263 156.2 168.936 156.2Z" fill="#42230C"/>
            <path d="M172.564 182.442C168.204 176.091 160.891 171.925 152.605 171.925C144.319 171.925 137.005 176.091 132.645 182.442" stroke="#42230C" stroke-width="2.58272" stroke-linecap="round"/>
            <circle cx="113.29" cy="67.8932" r="3.62903" stroke="#42230C" stroke-width="1.54963"/>
            <circle cx="248.774" cy="181.603" r="2.41935" stroke="#42230C" stroke-width="1.54963"/>
            <path d="M113.291 107.812H167.726M113.291 120.514H145.952" stroke="#DCBDAB" stroke-width="1.54963" stroke-linecap="round"/>
            <path d="M103.613 217.893H201.597M103.613 205.796H162.403" stroke="#DCBDAB" stroke-width="1.54963" stroke-linecap="round"/>
            <circle cx="59.4597" cy="162.853" r="5.44355" stroke="#42230C" stroke-width="1.54963"/>
            <path d="M223.413 87.248H235.468M214.903 76.8119V66.6835" stroke="#91876E" stroke-width="1.54963" stroke-linecap="round"/>
            <path d="M222.704 78.9568L230.722 70.9382" stroke="#91876E" stroke-width="1.54963" stroke-linecap="round"/>
            <ellipse cx="152.605" cy="263.256" rx="61.0887" ry="5.44355" fill="#DCBDAB"/>
            </svg>
            <p style={{ fontSize: "26px", fontWeight: "500" }}>No Database Connection.</p>
          </div>
        ) : sortedOrgs.length === 0 ? (
          <div className="no-results">
            <svg width="304" height="300" viewBox="0 0 304 300" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="148.371" cy="140.398" r="105.242" fill="#FFF8EA"/>
            <circle cx="148.371" cy="140.398" r="82.2581" fill="#F9E6CB"/>
            <path d="M148.918 244.151C139.256 254.027 125.779 260.156 110.871 260.156C93.0764 260.156 77.3215 251.424 67.6574 238.011C62.8869 250.938 50.4554 260.156 35.871 260.156C17.1646 260.156 2 244.992 2 226.285C2 207.579 17.1646 192.414 35.871 192.414C44.3352 192.414 52.0744 195.519 58.0116 200.652C61.1183 174.215 83.5994 153.705 110.871 153.705C129.246 153.705 145.446 163.015 155.01 177.176C162.974 170.815 173.071 167.011 184.056 167.011C204.326 167.011 221.572 179.96 227.971 198.037C232.85 195.23 238.508 193.624 244.54 193.624C262.251 193.624 276.729 207.464 277.749 224.919C279.657 224.237 281.713 223.866 283.855 223.866C293.876 223.866 302 231.99 302 242.011C302 252.032 293.876 260.156 283.855 260.156C276.943 260.156 270.933 256.291 267.87 250.605C261.866 256.512 253.629 260.156 244.54 260.156C233.329 260.156 223.413 254.61 217.387 246.112C208.929 254.777 197.121 260.156 184.056 260.156C170.033 260.156 157.457 253.958 148.918 244.151Z" fill="white"/>
            <path d="M2 226.285C2 207.579 17.1646 192.414 35.871 192.414C44.3352 192.414 52.0744 195.519 58.0116 200.652C61.1183 174.215 83.5994 153.705 110.871 153.705C129.246 153.705 145.446 163.015 155.01 177.176C162.974 170.815 173.071 167.011 184.056 167.011C204.326 167.011 221.572 179.96 227.971 198.037C232.85 195.23 238.508 193.624 244.54 193.624C262.251 193.624 276.729 207.464 277.749 224.919C279.657 224.237 281.713 223.866 283.855 223.866C293.876 223.866 302 231.99 302 242.011" stroke="#9D7045" stroke-width="2.06618" stroke-linecap="round"/>
            <circle cx="211.274" cy="96.8497" r="3.62903" stroke="#42230C" stroke-width="1.54963"/>
            <circle cx="245.145" cy="183.947" r="2.41935" stroke="#42230C" stroke-width="1.54963"/>
            <circle cx="55.8308" cy="165.197" r="5.44355" stroke="#42230C" stroke-width="1.54963"/>
            <path d="M97.5228 125.882H85.4677M106.032 115.446V105.318" stroke="#9D7045" stroke-width="1.54963" stroke-linecap="round"/>
            <path d="M98.2319 117.591L90.2134 109.572" stroke="#9D7045" stroke-width="1.54963" stroke-linecap="round"/>
            <ellipse cx="148.976" cy="254.713" rx="61.0887" ry="5.44355" fill="#DCBDAB"/>
            <circle cx="145.347" cy="161.568" r="34.4758" fill="#FFF8EA"/>
            <rect x="176.203" y="176.457" width="67.4287" height="24.1324" rx="9.09244" transform="rotate(45 176.203 176.457)" fill="#42230C"/>
            <circle cx="145.588" cy="162.906" r="40.9753" transform="rotate(45 145.588 162.906)" stroke="#42230C" stroke-width="6.06162"/>
            <rect width="29.0736" height="5.01269" rx="1.51541" transform="matrix(-0.707107 -0.707107 -0.707107 0.707107 157.639 171.434)" fill="#9D7045"/>
            <rect width="29.0736" height="5.01269" rx="1.51541" transform="matrix(-0.707107 0.707107 0.707107 0.707107 154.095 150.875)" fill="#9D7045"/>
            <path fill-rule="evenodd" clip-rule="evenodd" d="M149.23 105.487C147.745 105.394 146.466 106.521 146.373 108.006C146.279 109.49 147.406 110.769 148.891 110.863C161.117 111.634 173.118 116.689 182.461 126.032C189.156 132.727 193.646 140.782 195.939 149.305C196.326 150.741 197.803 151.592 199.239 151.206C200.676 150.82 201.527 149.342 201.14 147.906C198.608 138.496 193.649 129.603 186.269 122.224C175.964 111.918 162.715 106.338 149.23 105.487ZM139.4 110.33C140.887 110.33 142.093 109.125 142.093 107.637C142.093 106.15 140.887 104.945 139.4 104.945C137.913 104.945 136.707 106.15 136.707 107.637C136.707 109.125 137.913 110.33 139.4 110.33Z" fill="#9D7045"/>
            <path d="M183.53 194.385L210.998 221.853" stroke="white" stroke-width="2.2998" stroke-linecap="round"/>
            </svg>
            <p style={{ fontSize: "26px", fontWeight: "600", letterSpacing: "1px" }}>No organizations match your search query.</p>
            <p>Try rephrasing your search or clearing tags.</p>
          </div>
        ) : (
          <>
          <div className="row">
              {sortedOrgs.map((org, index) => (
                  <div className="col-sm-12 col-md-6 col-lg-4" key={index}>
                      <OrgCard org={org} toggleStarred={toggleStarred} />
                  </div>
              ))}
          </div>
          <div className="row justify-content-md-center align-items-center end-of-results">
            <div className="col-md-auto">
              <svg width="129" height="128" viewBox="0 0 129 128" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path fill-rule="evenodd" clip-rule="evenodd" d="M126.42 82.6C126.42 81.1641 125.256 80 123.82 80H10.0964C8.66046 80 7.4964 81.1641 7.4964 82.6C7.4964 84.0359 8.66045 85.2 10.0964 85.2H25.3402C26.7761 85.2 27.9402 86.3641 27.9402 87.8C27.9402 89.2359 26.7761 90.4 25.3402 90.4H22.2909C20.855 90.4 19.6909 91.5641 19.6909 93C19.6909 94.4359 20.855 95.6 22.2909 95.6H31.3402C32.7761 95.6 33.9402 96.7641 33.9402 98.2C33.9402 99.6359 32.7761 100.8 31.3402 100.8H27.2909C25.855 100.8 24.6909 101.964 24.6909 103.4C24.6909 104.836 25.855 106 27.2909 106H89.2247C90.6606 106 91.8247 104.836 91.8247 103.4C91.8247 101.964 90.6606 100.8 89.2247 100.8H75.5204C74.0845 100.8 72.9204 99.6359 72.9204 98.2C72.9204 96.7641 74.0845 95.6 75.5204 95.6H115.723C117.159 95.6 118.323 94.4359 118.323 93C118.323 91.5641 117.159 90.4 115.723 90.4H102.273C100.837 90.4 99.6727 89.2359 99.6727 87.8C99.6727 86.3641 100.837 85.2 102.273 85.2H123.82C125.256 85.2 126.42 84.0359 126.42 82.6ZM42.2788 100.8C40.8428 100.8 39.6788 99.6359 39.6788 98.2C39.6788 96.7641 40.8428 95.6 42.2788 95.6H50.8204C52.2564 95.6 53.4204 96.7641 53.4204 98.2C53.4204 99.6359 52.2564 100.8 50.8204 100.8H42.2788Z" fill="#FEE9E4"/>
              <path d="M95.0526 103.4C95.0526 101.964 96.2167 100.8 97.6526 100.8H110.027C111.463 100.8 112.627 101.964 112.627 103.4C112.627 104.836 111.463 106 110.027 106H97.6526C96.2167 106 95.0526 104.836 95.0526 103.4Z" fill="#FEE9E4"/>
              <path d="M13.8976 93C13.8976 91.5641 12.7336 90.4 11.2976 90.4H5.02041C3.58447 90.4 2.42041 91.5641 2.42041 93C2.42041 94.4359 3.58447 95.6 5.02041 95.6H11.2976C12.7336 95.6 13.8976 94.4359 13.8976 93Z" fill="#FEE9E4"/>
              <rect x="32.7607" y="51.3849" width="31.2831" height="34.4114" fill="#FFCC80"/>
              <path d="M32.7606 51.3849H64.0437L55.4408 41.9999H24.1577L32.7606 51.3849Z" fill="#BE985E"/>
              <path d="M32.7605 51.3849V62.725H21.4204L32.7605 51.3849Z" fill="#BE985E"/>
              <rect x="64.0435" y="51.3849" width="35.9756" height="34.4114" fill="#BE985E"/>
              <path d="M64.0435 51.3849H100.019L107.84 66.2444H71.8642L64.0435 51.3849Z" fill="#F4C988"/>
              <path d="M64.0435 51.3849H100.019L107.84 44.3462H71.8642L64.0435 51.3849Z" fill="#FFF4D9"/>
              <rect x="37.4204" y="58" width="16" height="4" fill="#BE985E"/>
              <path d="M26.4204 28.1207L32.9012 34.224" stroke="#BEA95E" stroke-width="2" stroke-linecap="round"/>
              <path d="M39.2163 23L40.802 30.7486" stroke="#BEA95E" stroke-width="2" stroke-linecap="round"/>
              <path d="M102.961 28.1207L96.4802 34.224" stroke="#BEA95E" stroke-width="2" stroke-linecap="round"/>
              <path d="M90.165 23L88.5793 30.7486" stroke="#BEA95E" stroke-width="2" stroke-linecap="round"/>
              </svg>
            </div>
            <div className="col-md-auto">
              <p style={{ marginBottom: "0px", fontSize: "20px" }}>End of Search Results.</p>
              <p>Didn’t find what you were looking for? Try rephrasing your search.</p>
            </div>
          </div>
          </>
        )}
      </div>
    </div>
  );
}
