export class User {
     private firstName: string;
     private middleName: string;
     private lastName: string;
     private studentNo: string;
     private orgsJoined: Organization[];
     private role: string;

     constructor(
          firstName: string,
          middleName: string,
          lastName: string,
          studentNo: string,
          orgsJoined: Organization[] = [],
          role: string,
     ) {
               this.firstName = firstName;
               this.middleName = middleName;
               this.lastName = lastName;
               this.studentNo = studentNo;
               this.orgsJoined = orgsJoined;
               this.role = role;
     }

     public getFirstName() {
          return this.firstName;
     }
     
     public getMiddleName() {
          return this.middleName;
     }
     
     public getLastName() {
          return this.lastName;
     }
     
     public getStudentNumber() {
          return this.studentNo;
     }     

     public getOrgsJoined() {
          const orgs = this.orgsJoined;
          return orgs;
     }

     public getOrgNamesJoined() {
          const orgs = this.orgsJoined.map((org) => org.getOrgName());
          return orgs;
     }

     public getRole() {
          return this.role;
     }
     
     public addOrgsJoined(org: Organization) {
          this.orgsJoined.push(org);
     }

     // deleting an item in an array from https://stackoverflow.com/questions/5767325/how-can-i-remove-a-specific-item-from-an-array-in-javascript
     // bugged atm
     /*public deleteOrgsJoined(org: Organization) {
          this.orgsJoined.filter((item) => item !== org);
          console.log(this.orgsJoined);
     }*/
}

export class Organization {
    private orgName: string;
    private orgId: string;
    private orgLogo: string;
    private orgAcronym: string;
    private orgPictures: string[];
    private orgBio: string;
    private orgTags: string[];
    private dateFounded: string;
    private orgLocation: string;
    private orgAffiliations: string[];
    private orgEmails: string[];
    private orgWebsite: string;
    private orgFacebook: string;
    private orgDescription: string;
    private orgScope: string;
    private openForApplications: string;

    constructor (
        orgName: string = "N/A",
        orgId: string = "N/A",
        orgLogo: string = "N/A",
        orgAcronym: string = "N/A",
        orgPictures: string[] = [],
        orgBio: string = "N/A",
        orgTags: string[] = [],
        dateFounded: string = "N/A",
        orgLocation: string = "N/A",
        orgAffiliations: string[] = [],
        orgEmails: string[] = [],
        orgWebsite: string = "N/A",
        orgFacebook: string = "N/A",
        orgDescription: string = "N/A",
        orgScope: string = "N/A",
        openForApplications: string = "N/A"  
     )   {
            this.orgId = orgId;
            this.orgLogo = orgLogo;
            this.orgName = orgName;
            this.orgAcronym = orgAcronym;
            this.orgPictures = orgPictures;
            this.orgBio = orgBio;
            this.orgTags = orgTags;
            this.dateFounded = dateFounded;
            this.orgLocation = orgLocation;
            this.orgAffiliations = orgAffiliations;
            this.orgEmails = orgEmails;
            this.orgWebsite = orgWebsite;
            this.orgFacebook = orgFacebook;
            this.orgDescription = orgDescription;
            this.orgScope = orgScope;
            this.openForApplications = openForApplications;
     }

     public getOrgId() {
          return this.orgId;
     }
     
     public getOrgLogo() {
          return this.orgLogo;
     }
     
     public getOrgName() {
          return this.orgName;
     }
     
     public getOrgAcronym() {
          return this.orgAcronym;
     }
     
     public getOrgPictures() {
          const pics = this.orgPictures
          return pics;
     }
     
     public getOrgBio() {
          return this.orgBio;
     }
     
     public getOrgTags() {
          const tags = this.orgTags;
          return tags;
     }
     
     public getDateFounded() {
          return this.dateFounded;
     }
     
     public getOrgLocation() {
          return this.orgLocation;
     }
     
     public getOrgAffiliations() {
          const affiliations = this.orgAffiliations;
          return affiliations;
     }
     
     public getOrgEmails() {
          const emails = this.orgEmails;
          return emails;
     }
     
     public getOrgWebsite() {
          return this.orgWebsite;
     }
     
     public getOrgFacebook() {
          return this.orgFacebook;
     }
     
     public getOrgDescription() {
          return this.orgDescription;
     }
     
     public getOrgScope() {
          return this.orgScope;
     }
     
     public getOpenForApplications() {
          return this.openForApplications;
     }
}