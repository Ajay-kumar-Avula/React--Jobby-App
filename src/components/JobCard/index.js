import {Link} from 'react-router-dom'
import {BsStarFill} from 'react-icons/bs'

import './index.css'

const JobCard = props => {
  const {jobData} = props
  const {
    companyLogoUrl,
    id,
    title,
    rating,
    location,
    employmentType,
    packagePerAnnum,
    jobdescription,
  } = jobData
  return (
    <Link to={`/jobs/${id}`}>
      <li className="each-job-item-con" key={id}>
        <div>
          <img
            src={companyLogoUrl}
            className="company-logo-url"
            alt="company logo"
          />
          <p>{title}</p>
          <BsStarFill className="star-icon-style" />
          <p>{rating}</p>
        </div>
        <div className="location-type-salary-con">
          <div className="location-type">
            <p>{location}</p>
            <p>{employmentType}</p>
          </div>
          <p>{packagePerAnnum}</p>
        </div>
        <hr className="hr-line" />
        <h1>Description</h1>
        <p>{jobdescription}</p>
      </li>
    </Link>
  )
}
export default JobCard
