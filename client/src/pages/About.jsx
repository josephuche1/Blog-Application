import React from 'react';
import { Link } from 'react-router-dom';

const About = () => {
    return (
        <div className=" py-4 vw-100 border ps-5" style={{ overflowY: 'auto', height: '100vh' }}>
            <div className="w-75">
                <div className="px-4 py-3 my-2 text-center">
                 <h1 className="display-5 fw-bold text-body-emphasis">About the App</h1>
                 <div className="col-lg-6 mx-auto">
                    <p className="lead mb-4">Quickly design and customize responsive mobile-first sites with Bootstrap, the world’s most popular front-end open source toolkit, featuring Sass variables and mixins, responsive grid system, extensive prebuilt components, and powerful JavaScript plugins. </p>
                 </div>
                 
                 <div>
                    <Link to="/home" className="btn btn-primary btn-lg px-4 me-sm-3">Return Home</Link>
                 </div>
                </div>
            </div>
            <div className="w-75">
            <div className="container px-4 py-5" id="featured-3">
              <h2 className="pb-2 border-bottom">Features</h2>
              <div className="row g-4 py-5 row-cols-1 row-cols-lg-3">
                <div className="feature col">
                   <h3 className="fs-2 text-body-emphasis">Create Posts</h3>
                   <p>Paragraph of text beneath the heading to explain the heading. We'll add onto it with another sentence and probably just keep going until we run out of words.</p>    
                </div>
                <div className="feature col">
                   <h3 className="fs-2 text-body-emphasis">Like Posts</h3>
                   <p>Paragraph of text beneath the heading to explain the heading. We'll add onto it with another sentence and probably just keep going until we run out of words.</p>    
                </div>
                <div className="feature col">
                   <h3 className="fs-2 text-body-emphasis">Get Notified</h3>
                   <p>Paragraph of text beneath the heading to explain the heading. We'll add onto it with another sentence and probably just keep going until we run out of words.</p>    
                </div>
                <div className="feature col">
                   <h3 className="fs-2 text-body-emphasis">Create Account</h3>
                   <p>Paragraph of text beneath the heading to explain the heading. We'll add onto it with another sentence and probably just keep going until we run out of words.</p>    
                </div>
              </div>
            </div>
            </div>
        </div>
    )
}

export default About;