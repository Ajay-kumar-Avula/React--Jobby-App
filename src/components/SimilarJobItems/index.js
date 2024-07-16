import {BsFillBriefcaseFill, BsStarFill} from 'react-icons/bs'
import {MdLocationOn} from 'react-icons/md'
import './index.css'

const SimilarJobItems = props => {
  const {jobDetails} = props
  const {
    companyLogoUrl,
    title,
    rating,
    location,
    employmentType,
    jobdescription,
  } = jobDetails

  return (
    <li className="similar-job-item">
      <div className="logo-title-location-con">
        <div className="logo-title-con">
          <img
            src={companyLogoUrl}
            alt="similar job company logo"
            className="company-logo"
          />
          <div className="title-rating-con">
            <h1>{title}</h1>
            <div className="rating-con">
              <BsStarFill />
              <p>{rating}</p>
            </div>
          </div>
        </div>
        <h1>Description</h1>
        <p>{jobdescription}</p>
        <div className="location-employee-con">
          <div className="location-con">
            <MdLocationOn />
            <p>{location}</p>
          </div>
          <div className="employmentType-con">
            <BsFillBriefcaseFill />
            <p>{employmentType}</p>
          </div>
        </div>
      </div>
    </li>
  )
}
export default SimilarJobItems
