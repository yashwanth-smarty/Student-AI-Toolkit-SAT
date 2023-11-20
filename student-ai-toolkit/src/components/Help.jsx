import Navbar from "./Navbar";
function Help() {
    return (
        <div>
        <Navbar/>
        <div className="help-section">
      <h2>Welcome to the Student AI Toolkit Help Center</h2>

      <div className="help-content">
        <section>
          <h3>1. Getting Started</h3>
          <p>Overview of the Student AI Toolkit</p>
          <p>Creating an Account (if applicable)</p>
          <p>Logging In</p>
        </section>

        <section>
          <h3>2. Feature Guides</h3>
          <ul>
            <li>
              <h4>File Inquiry</h4>
              <p>How to Upload Files</p>
              <p>Interpreting Results</p>
            </li>
            <li>
              <h4>File Inquiry</h4>
              <p>How to Upload Files</p>
              <p>Interpreting Results</p>
            </li><li>
              <h4>File Inquiry</h4>
              <p>How to Upload Files</p>
              <p>Interpreting Results</p>
            </li><li>
              <h4>File Inquiry</h4>
              <p>How to Upload Files</p>
              <p>Interpreting Results</p>
            </li><li>
              <h4>File Inquiry</h4>
              <p>How to Upload Files</p>
              <p>Interpreting Results</p>
            </li>
            {/* Add similar lists for other features */}
          </ul>
        </section>

        <section>
          <h3>3. Advanced Tips</h3>
          <p>Customizing Your Experience</p>
          <p>Keyboard Shortcuts</p>
          <p>Integrating with External Tools</p>
        </section>

        <section>
          <h3>4. Troubleshooting</h3>
          <p>Common Issues and Solutions</p>
          <p>Getting Support</p>
        </section>
      </div>
    </div>
    </div>
    )
}

export default Help;