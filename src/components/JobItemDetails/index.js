import {Component} from 'react'
import Loader from 'react-loader-spinner'
import Cookies from 'js-cookie'
import {BsFillBriefcaseFill, BsStarFill} from 'react-icons/bs'
import {MdLocationOn} from 'react-icons/md'
import {BiLinkExternal} from 'react-icons/bi'
import Header from '../Header'
import SimilarJobItems from '../SimilarJobItems'
import './index.css'

const apiStatusConst = {
  initial: 'INTIAL',
  success: 'SUCCESS',
  failure: 'FIALURE',
  inProgress: 'INPROGRESS',
}
class JobItemDetails extends Component {
  state = {jobsData: {}, similarJobsData: [], apiStatus: apiStatusConst.initial}

  componentDidMount() {
    this.getJobData()
  }

  getFormattedSimilarData = data => ({
    companyLogoUrl: data.company_logo_url,
    employmentType: data.employment_type,
    id: data.id,
    jobdescription: data.job_description,
    location: data.location,
    packagePerAnnum: data.package_per_annum,
    rating: data.rating,
    title: data.title,
  })

  getFormattedData = data => ({
    companyLogoUrl: data.company_logo_url,
    companyWebSiteUrl: data.company_website_url,
    employmentType: data.employment_type,
    id: data.id,
    jobdescription: data.job_description,
    location: data.location,
    packagePerAnnum: data.package_per_annum,
    rating: data.rating,
    title: data.title,
    lifeAtCompany: {
      description: data.life_at_company.description,
      imageUrl: data.life_at_company.image_url,
    },
    skills: data.skills.map(each => ({
      imageUrl: each.image_url,
      name: each.name,
    })),
  })

  getJobData = async () => {
    this.setState({apiStatus: apiStatusConst.inProgress})
    const {match} = this.props
    const {params} = match
    const {id} = params
    const jwtToken = Cookies.get('jwt_token')
    const url = `https://apis.ccbp.in/jobs/${id}`
    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }
    const response = await fetch(url, options)
    if (response.ok === true) {
      const data = await response.json()
      console.log(data)
      const updateData = this.getFormattedData(data.job_details)
      const updateSimilarData = data.similar_jobs.map(each =>
        this.getFormattedSimilarData(each),
      )

      console.log(updateData)
      console.log(updateSimilarData)
      this.setState({
        apiStatus: apiStatusConst.success,
        similarJobsData: updateSimilarData,
        jobsData: updateData,
      })
    } else {
      this.setState({apiStatus: apiStatusConst.failure})
    }
  }

  renderfailureView = () => (
    <div className="failure-con">
      <img
        src="https://assets.ccbp.in/frontend/react-js/failure-img.png "
        alt="failure view"
        className="failure-img"
      />
      <h1>Oops! Something Went Wrong</h1>

      <p>We cannot seem to find the page you are looking for</p>
      <button type="button" onClick={this.getJobData}>
        Retry
      </button>
    </div>
  )

  renderLoadingView = () => (
    <div className="loader-con" data-testid="loader">
      <Loader type="ThreeDots" color="#ffffff" height="50" width="50" />
    </div>
  )

  renderJobDetailsView = () => {
    const {jobsData, similarJobsData} = this.state
    const {
      companyLogoUrl,
      companyWebSiteUrl,
      employmentType,
      jobdescription,
      location,
      title,
      rating,
      packagePerAnnum,
      lifeAtCompany,
      skills,
    } = jobsData
    const {description, imageUrl} = lifeAtCompany
    return (
      <div className="job-details-view-con">
        <div className="job-item">
          <div className="logo-title-location-con">
            <div className="logo-title-con">
              <img
                src={companyLogoUrl}
                alt="job details company logo"
                className="company-logo"
              />
              <div className="title-rating-con">
                <h1>{title}</h1>
                <div className="rating-con">
                  <BsStarFill className="rating-icon" />
                  <p>{rating}</p>
                </div>
              </div>
            </div>
            <div className="location-package-con">
              <div className="location-employee-con">
                <div className="location-con">
                  <MdLocationOn className="location-icon" />
                  <p>{location}</p>
                </div>
                <div className="employee-type-con">
                  <BsFillBriefcaseFill className="brief-case-icon" />
                  <p>{employmentType}</p>
                </div>
              </div>
              <p>{packagePerAnnum}</p>
            </div>
          </div>
          <hr className="hr-line" />
          <div className="description-visit-con">
            <h1>Description</h1>
            <div className="visit-con">
              <a href={companyWebSiteUrl}>Visit</a>
              <BiLinkExternal />
            </div>
          </div>
          <p>{jobdescription}</p>
          <h1>Skills</h1>
          <ul className="skill-list-con">
            {skills.map(eachSkill => (
              <li className="each-skill">
                <div className="skills-con">
                  <img src={eachSkill.imageUrl} alt={eachSkill.name} />
                  <p>{eachSkill.name}</p>
                </div>
              </li>
            ))}
          </ul>
          <h1>Life at Company</h1>
          <div className="lifeAtCompany-description-image-con">
            <p>{description}</p>
            <img
              src={imageUrl}
              alt="life at company"
              className="lifeAtCompany-img"
            />
          </div>
        </div>
        <h1>Similar Jobs</h1>
        <ul className="similar-job-list">
          {similarJobsData.map(eachjob => (
            <SimilarJobItems key={eachjob.id} jobDetails={eachjob} />
          ))}
        </ul>
      </div>
    )
  }

  renderJobdetails = () => {
    const {apiStatus} = this.state
    switch (apiStatus) {
      case apiStatusConst.success:
        return this.renderJobDetailsView()
      case apiStatusConst.failure:
        return this.renderfailureView()
      case apiStatusConst.inProgress:
        return this.renderLoadingView()
      default:
        return null
    }
  }

  render() {
    return (
      <>
        <Header />
        <div className="job-item-details-con">{this.renderJobdetails()}</div>
      </>
    )
  }
}
export default JobItemDetails
