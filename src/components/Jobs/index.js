import {Component} from 'react'

import Cookies from 'js-cookie'
import Loader from 'react-loader-spinner'
import {AiOutlineSearch} from 'react-icons/ai'

import Header from '../Header'

import JobCard from '../JobCard'
import './index.css'

const employmentTypesList = [
  {
    label: 'Full Time',
    employmentTypeId: 'FULLTIME',
  },
  {
    label: 'Part Time',
    employmentTypeId: 'PARTTIME',
  },
  {
    label: 'Freelance',
    employmentTypeId: 'FREELANCE',
  },
  {
    label: 'Internship',
    employmentTypeId: 'INTERNSHIP',
  },
]

const salaryRangesList = [
  {
    salaryRangeId: '1000000',
    label: '10 LPA and above',
  },
  {
    salaryRangeId: '2000000',
    label: '20 LPA and above',
  },
  {
    salaryRangeId: '3000000',
    label: '30 LPA and above',
  },
  {
    salaryRangeId: '4000000',
    label: '40 LPA and above',
  },
]

const apiProfileStatusConst = {
  initial: 'INTIAL',
  success: 'SUCCESS',
  failure: 'FIALURE',
  inProgress: 'INPROGRESS',
}
const apiJobStatusConst = {
  initial: 'INTIAL',
  success: 'SUCCESS',
  failure: 'FIALURE',
  inProgress: 'INPROGRESS',
}

class Jobs extends Component {
  state = {
    profileData: {},
    jobsData: [],
    checkBoxInput: [],
    radioInput: '',
    searchInput: '',
    apiProfileStatus: apiProfileStatusConst.initial,
    apiJobStatus: apiJobStatusConst.initial,
  }

  componentDidMount() {
    this.getProfileData()
    this.getJobsData()
  }

  getProfileData = async () => {
    this.setState({apiProfileStatus: apiProfileStatusConst.inProgress})

    const jwtToken = Cookies.get('jwt_token')

    const profileUrl = 'https://apis.ccbp.in/profile'
    const optionsProfile = {
      method: 'GET',
      headers: {Authorization: `Bearer ${jwtToken}`},
    }
    const responseprofile = await fetch(profileUrl, optionsProfile)
    if (responseprofile.ok === true) {
      const fetchedData = await responseprofile.json()
      console.log(fetchedData)
      const updatedData = {
        name: fetchedData.profile_details.name,
        profileImageUrl: fetchedData.profile_details.profile_image_url,
        shortBio: fetchedData.profile_details.short_bio,
      }

      this.setState({
        apiProfileStatus: apiProfileStatusConst.success,
        succesResponse: true,
        profileData: updatedData,
      })
    } else {
      this.setState({apiProfileStatus: apiProfileStatusConst.failure})
    }
  }

  getJobsData = async () => {
    this.setState({apiJobStatus: apiJobStatusConst.inProgress})
    const {checkBoxInput, radioInput, searchInput} = this.state
    const jwtToken = Cookies.get('jwt_token')
    const jobsUrl = `https://apis.ccbp.in/jobs?employement_type=${checkBoxInput}&minimum_package=${radioInput}&search=${searchInput}`
    const options = {
      method: 'GET',
      headers: {Authorization: `Bearer ${jwtToken}`},
    }
    const response = await fetch(jobsUrl, options)
    if (response.ok === true) {
      const data = await response.json()
      console.log(data)
      const updatejobsData = data.jobs.map(each => ({
        companyLogoUrl: each.company_logo_url,
        employmentType: each.employment_type,
        id: each.id,
        jobdescription: each.job_description,
        location: each.location,
        packagePerAnnum: each.package_per_annum,
        rating: each.rating,
        title: each.title,
      }))
      this.setState({
        apiJobStatus: apiJobStatusConst.success,
        jobsData: updatejobsData,
      })
      console.log(updatejobsData)
    } else {
      this.setState({apiJobStatus: apiJobStatusConst.failure})
    }
  }

  getProfileSuccessView = () => {
    const {profileData, succesResponse} = this.state
    if (succesResponse) {
      const {name, profileImageUrl, shortBio} = profileData
      return (
        <div className="profile-con">
          <img src={profileImageUrl} alt="profile" className="profile-icon" />
          <h1 className="profile-name">{name}</h1>
          <p className="profile-description">{shortBio}</p>
        </div>
      )
    }
    return null
  }

  renderLoadingView = () => (
    <div className="loader-con" data-testid="loader">
      <Loader type="ThreeDots" color="#0b69ff" height="50" width="50" />
    </div>
  )

  onRetryProfile = () => {
    this.getProfileData()
  }

  getProfileFailureView = () => (
    <div className="failure-btn-con">
      <button
        className="failure-btn"
        type="button"
        onClick={this.onRetryProfile}
      >
        Retry
      </button>
    </div>
  )

  renderProfileView = () => {
    const {apiProfileStatus} = this.state
    switch (apiProfileStatus) {
      case apiProfileStatusConst.success:
        return this.getProfileSuccessView()
      case apiProfileStatusConst.failure:
        return this.getProfileFailureView()
      case apiProfileStatusConst.inProgress:
        return this.renderLoadingView()
      default:
        return null
    }
  }

  onChangeInput = event => {
    this.setState({checkBoxInput: event.taget.value})
  }

  onGetCheckBoxView = () => (
    <ul className="check-box-con">
      {employmentTypesList.map(each => (
        <li className="list-con" key={each.employmentTypeId}>
          <input
            type="checkbox"
            className="input"
            id={each.employmentTypeId}
            onChange={this.onChangeInput}
          />
          <label htmlFor={each.employmentTypeId} className="label">
            {each.label}
          </label>
        </li>
      ))}
    </ul>
  )

  onChangeRadioBtn = event => {
    this.setState({radioInput: event.target.value})
  }

  onGetRadioButtonView = () => (
    <ul className="check-box-con">
      {salaryRangesList.map(each => (
        <li className="list-con" key={each.salaryRangeId}>
          <input
            type="checkbox"
            id={each.salaryRangeId}
            className="radio"
            onChange={this.onChangeRadioBtn}
            name="options"
          />
          <label className="label" htmlFor={each.salaryRangeId}>
            {each.label}
          </label>
        </li>
      ))}
    </ul>
  )

  ongetjobsSuccessView = () => {
    const {jobsData} = this.state
    const nojobs = jobsData.length === 0
    return nojobs ? (
      <div className="no-jobs-con">
        <img
          src="https://assets.ccbp.in/frontend/react-js/no-jobs-img.png "
          alt="no jobs"
          className="no-jobs-img"
        />
        <h1>No Jobs Found</h1>
        <p>We could not find any jobs.try other filter</p>
      </div>
    ) : (
      <ul className="job-items-con">
        {jobsData.map(each => (
          <JobCard key={each.id} jobData={each} />
        ))}
      </ul>
    )
  }

  onRetryJobs = () => {
    this.getJobsData()
  }

  ongetJobsFailureView = () => (
    <div className="failure-img-btn-con">
      <img
        src="https://assets.ccbp.in/frontend/react-js/failure-img.png"
        className="failure-img"
        alt="failure view"
      />
      <h1>Oops! Something Went Wrong</h1>
      <p>we cant not seem to be find the page you are looking for</p>
      <div className="failure-btn-con">
        <button
          className="failure-btn"
          type="button"
          onClick={this.onRetryJobs}
        >
          Retry
        </button>
      </div>
    </div>
  )

  onRenderJobsStatus = () => {
    const {apiJobStatus} = this.state

    switch (apiJobStatus) {
      case apiJobStatusConst.success:
        return this.ongetjobsSuccessView()
      case apiJobStatusConst.failure:
        return this.ongetJobsFailureView()
      case apiJobStatusConst.inProgress:
        return this.renderLoadingView()
      default:
        return null
    }
  }

  getSearchInput = event => {
    this.setState({searchInput: event.target.value})
  }

  onSubmitSearchInput = () => {
    this.getJobsData()
  }

  onEntersearchInput = event => {
    if (event.key === 'Enter') {
      this.getJobsData()
    }
  }

  render() {
    const {searchInput} = this.state
    return (
      <>
        <Header />
        <div className="jobs-container">
          <div className="side-bar-container">
            {this.renderProfileView()}
            <hr className="hr-line" />
            <h1 className="text">Type of Employment</h1>
            {this.onGetCheckBoxView()}
            <hr className="hr-line" />
            <h1 className="text">Salary Range</h1>
            {this.onGetRadioButtonView()}
          </div>
          <div className="jobs-con">
            <div>
              <input
                value={searchInput}
                type="search"
                className="search-input"
                onChange={this.getSearchInput}
                onKeyDown={this.onEntersearchInput}
                placeholder="Search"
              />
              <button
                type="button"
                data-testid="searchButton"
                className="search-btn"
                onClick={this.onSubmitSearchInput}
              >
                <AiOutlineSearch className="search-icon" /> Click
              </button>
            </div>
            {this.onRenderJobsStatus()}
          </div>
        </div>
      </>
    )
  }
}
export default Jobs
