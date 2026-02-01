/**
 * Oracle Fusion + AI Roadmap - Interactive Features
 * Pure JavaScript - No External Dependencies
 */

// ===================================
// Initialize on DOM Ready
// ===================================
document.addEventListener('DOMContentLoaded', function() {
    initializeSliders();
    initializeAttritionDemo();
    initializeScreeningDemo();
    initializeWorkforceDemo();
    initializeSmoothScroll();
    initializeScrollReveal();
});

// ===================================
// Slider Value Display
// ===================================
function initializeSliders() {
    const sliders = document.querySelectorAll('.demo-slider');
    
    sliders.forEach(slider => {
        const valueDisplay = document.getElementById(slider.id + '-value');
        
        slider.addEventListener('input', function() {
            if (valueDisplay) {
                valueDisplay.textContent = this.value;
            }
        });
    });
}

// ===================================
// Attrition Prediction Demo
// ===================================
function initializeAttritionDemo() {
    const calculateBtn = document.getElementById('calculate-risk');
    
    if (calculateBtn) {
        calculateBtn.addEventListener('click', function() {
            const tenure = parseFloat(document.getElementById('tenure').value);
            const performance = parseFloat(document.getElementById('performance').value);
            const compensation = parseFloat(document.getElementById('compensation').value);
            const promotion = parseFloat(document.getElementById('promotion').value);
            
            const result = calculateAttritionRisk(tenure, performance, compensation, promotion);
            displayAttritionResult(result);
        });
    }
}

function calculateAttritionRisk(tenure, performance, compensation, promotion) {
    let riskScore = 0;
    const factors = [];
    const recommendations = [];
    
    // Tenure analysis
    if (tenure < 1) {
        riskScore += 25;
        factors.push('New hire adjustment period - increased flight risk');
    } else if (tenure > 5 && tenure < 8) {
        riskScore += 20;
        factors.push('Mid-career professionals often seek new challenges');
    } else if (tenure > 8) {
        riskScore += 15;
        factors.push('Long tenure may indicate reduced engagement');
    }
    
    // Performance paradox
    if (performance >= 4) {
        riskScore += 20;
        factors.push('High performers are competitive and receive external offers');
        recommendations.push('Priority retention: Offer career advancement or special projects');
    } else if (performance <= 2) {
        riskScore += 15;
        factors.push('Low performance may lead to voluntary or involuntary separation');
        recommendations.push('Performance improvement plan or role reassessment needed');
    }
    
    // Compensation analysis
    if (compensation < 90) {
        riskScore += 35;
        factors.push('Below-market compensation is primary attrition driver');
        recommendations.push('URGENT: Compensation adjustment required to retain employee');
    } else if (compensation < 100) {
        riskScore += 15;
        factors.push('Compensation slightly below market average');
        recommendations.push('Consider market adjustment during next review cycle');
    } else if (compensation > 115) {
        riskScore -= 10;
        factors.push('Above-market compensation reduces flight risk');
    }
    
    // Promotion gap
    if (promotion >= 4) {
        riskScore += 25;
        factors.push('Extended promotion gap creates dissatisfaction');
        recommendations.push('Evaluate for promotion or provide stretch assignments');
    } else if (promotion >= 3) {
        riskScore += 10;
        factors.push('Promotion gap approaching concerning threshold');
    }
    
    // Calculate final score (0-100)
    riskScore = Math.min(Math.max(riskScore, 0), 100);
    
    // Determine risk level
    let riskLevel = 'Low';
    if (riskScore >= 60) {
        riskLevel = 'High';
        recommendations.push('Schedule immediate retention conversation with manager');
    } else if (riskScore >= 35) {
        riskLevel = 'Medium';
        recommendations.push('Monitor closely and address concerns proactively');
    } else {
        recommendations.push('Continue regular engagement and career development');
    }
    
    return {
        score: riskScore,
        level: riskLevel,
        factors: factors,
        recommendations: recommendations
    };
}

function displayAttritionResult(result) {
    const resultDiv = document.getElementById('attrition-result');
    
    if (!resultDiv) return;
    
    const scoreDiv = resultDiv.querySelector('.risk-score');
    const factorsDiv = resultDiv.querySelector('.risk-factors');
    const recommendationsDiv = resultDiv.querySelector('.recommendations');
    
    // Display risk score
    scoreDiv.innerHTML = `<strong>Attrition Risk: ${result.score.toFixed(0)}%</strong> - ${result.level} Risk`;
    scoreDiv.className = 'risk-score risk-' + result.level.toLowerCase();
    
    // Display risk factors
    if (result.factors.length > 0) {
        factorsDiv.innerHTML = '<h4>Key Risk Factors:</h4><ul>' + 
            result.factors.map(f => `<li>${f}</li>`).join('') + 
            '</ul>';
    } else {
        factorsDiv.innerHTML = '<h4>No significant risk factors identified</h4>';
    }
    
    // Display recommendations
    if (result.recommendations.length > 0) {
        recommendationsDiv.innerHTML = '<h4>Recommended Actions:</h4><ul>' + 
            result.recommendations.map(r => `<li>${r}</li>`).join('') + 
            '</ul>';
    }
    
    resultDiv.classList.add('active');
    
    // Smooth scroll to result
    resultDiv.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

// ===================================
// Resume Screening Demo
// ===================================
function initializeScreeningDemo() {
    const evaluateBtn = document.getElementById('evaluate-candidate');
    
    if (evaluateBtn) {
        evaluateBtn.addEventListener('click', function() {
            const jobRequirements = document.getElementById('job-requirements').value;
            const candidateSkills = document.getElementById('candidate-skills').value;
            
            const result = evaluateCandidate(jobRequirements, candidateSkills);
            displayScreeningResult(result);
        });
    }
}

function evaluateCandidate(requirements, skills) {
    // Extract keywords (simple tokenization)
    const requiredSkills = extractSkills(requirements);
    const candidateSkills = extractSkills(skills);
    
    // Find matches with semantic similarity
    const matched = [];
    const missing = [];
    
    requiredSkills.forEach(req => {
        const match = candidateSkills.find(skill => 
            areSimilarSkills(req, skill)
        );
        
        if (match) {
            matched.push(req);
        } else {
            missing.push(req);
        }
    });
    
    // Calculate match score
    const matchPercentage = requiredSkills.length > 0 
        ? (matched.length / requiredSkills.length * 100).toFixed(0)
        : 0;
    
    return {
        matchPercentage: matchPercentage,
        matched: matched,
        missing: missing,
        totalRequired: requiredSkills.length,
        totalCandidate: candidateSkills.length
    };
}

function extractSkills(text) {
    // Split by common delimiters and clean
    return text
        .toLowerCase()
        .split(/[,;\n]+/)
        .map(skill => skill.trim())
        .filter(skill => skill.length > 2);
}

function areSimilarSkills(skill1, skill2) {
    // Simple similarity check
    skill1 = skill1.toLowerCase();
    skill2 = skill2.toLowerCase();
    
    // Exact match
    if (skill1 === skill2) return true;
    
    // Contains check
    if (skill1.includes(skill2) || skill2.includes(skill1)) return true;
    
    // Common variations
    const variations = {
        'sql': ['database', 'query'],
        'python': ['py'],
        'analytics': ['analysis', 'analytical'],
        'data science': ['data analytics', 'data analysis'],
        'bi': ['business intelligence'],
        'erp': ['enterprise'],
        'hcm': ['human capital', 'hr']
    };
    
    for (let [key, values] of Object.entries(variations)) {
        if ((skill1.includes(key) || values.some(v => skill1.includes(v))) &&
            (skill2.includes(key) || values.some(v => skill2.includes(v)))) {
            return true;
        }
    }
    
    return false;
}

function displayScreeningResult(result) {
    const resultDiv = document.getElementById('screening-result');
    
    if (!resultDiv) return;
    
    const matchScoreDiv = resultDiv.querySelector('.match-score');
    const matchedSkillsDiv = resultDiv.querySelector('.matched-skills');
    const missingSkillsDiv = resultDiv.querySelector('.missing-skills');
    
    // Display match score
    let matchClass = 'risk-low';
    if (result.matchPercentage < 50) {
        matchClass = 'risk-high';
    } else if (result.matchPercentage < 75) {
        matchClass = 'risk-medium';
    }
    
    matchScoreDiv.innerHTML = `<strong>Match Score: ${result.matchPercentage}%</strong>`;
    matchScoreDiv.className = 'match-score ' + matchClass;
    
    // Display matched skills
    if (result.matched.length > 0) {
        matchedSkillsDiv.innerHTML = '<h4>Matched Skills (' + result.matched.length + '):</h4><ul>' + 
            result.matched.map(s => `<li>${s}</li>`).join('') + 
            '</ul>';
    } else {
        matchedSkillsDiv.innerHTML = '<h4>No matching skills found</h4>';
    }
    
    // Display missing skills
    if (result.missing.length > 0) {
        missingSkillsDiv.innerHTML = '<h4>Missing Skills (' + result.missing.length + '):</h4><ul>' + 
            result.missing.map(s => `<li>${s}</li>`).join('') + 
            '</ul><p><em>Consider as training opportunities or areas for candidate development</em></p>';
    } else {
        missingSkillsDiv.innerHTML = '<h4>All required skills present</h4>';
    }
    
    resultDiv.classList.add('active');
    
    // Smooth scroll to result
    resultDiv.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

// ===================================
// Workforce Planning Demo
// ===================================
function initializeWorkforceDemo() {
    const calculateBtn = document.getElementById('calculate-workforce');
    
    if (calculateBtn) {
        calculateBtn.addEventListener('click', function() {
            const currentTeam = parseInt(document.getElementById('current-team').value);
            const revenueGrowth = parseFloat(document.getElementById('revenue-growth').value);
            const automation = parseFloat(document.getElementById('automation').value);
            const attritionRate = parseFloat(document.getElementById('attrition-rate').value);
            
            const result = calculateWorkforcePlan(currentTeam, revenueGrowth, automation, attritionRate);
            displayWorkforceResult(result);
        });
    }
}

function calculateWorkforcePlan(currentTeam, revenueGrowth, automation, attritionRate) {
    // Calculate required team size based on growth
    const growthFactor = 1 + (revenueGrowth / 100);
    const automationFactor = 1 - (automation / 100);
    const attritionCount = Math.ceil(currentTeam * (attritionRate / 100));
    
    // Calculate requirements
    const targetTeamSize = Math.ceil(currentTeam * growthFactor * automationFactor);
    const netChange = targetTeamSize - currentTeam;
    const totalHiringNeed = netChange + attritionCount;
    
    // Build strategy recommendations
    const strategy = [];
    
    if (totalHiringNeed > currentTeam * 0.3) {
        strategy.push('AGGRESSIVE HIRING: Need exceeds 30% of current team - consider recruitment agency partnership');
    }
    
    if (automation > 20) {
        strategy.push('HIGH AUTOMATION: Focus on upskilling current team for higher-value work');
    }
    
    if (revenueGrowth > 30) {
        strategy.push('RAPID GROWTH: Implement structured onboarding and knowledge transfer programs');
    }
    
    if (attritionRate > 15) {
        strategy.push('HIGH ATTRITION: Investigate retention issues - hiring alone will not solve the problem');
    }
    
    if (netChange < 0) {
        strategy.push('EFFICIENCY GAINS: Automation reduces headcount needs - plan for role transitions');
    }
    
    // Timeline recommendations
    if (totalHiringNeed > 10) {
        strategy.push('TIMELINE: Stagger hiring over 6-9 months to ensure quality and integration');
    } else if (totalHiringNeed > 0) {
        strategy.push('TIMELINE: Target 3-6 month hiring cycle with phased onboarding');
    }
    
    return {
        currentTeam: currentTeam,
        targetTeam: targetTeamSize,
        netChange: netChange,
        attritionCount: attritionCount,
        totalHiring: totalHiringNeed,
        strategy: strategy
    };
}

function displayWorkforceResult(result) {
    const resultDiv = document.getElementById('workforce-result');
    
    if (!resultDiv) return;
    
    const projectionDiv = resultDiv.querySelector('.workforce-projection');
    const hiringDiv = resultDiv.querySelector('.hiring-needs');
    const strategyDiv = resultDiv.querySelector('.workforce-strategy');
    
    // Display projection
    const changeDirection = result.netChange > 0 ? 'Growth' : result.netChange < 0 ? 'Reduction' : 'Stable';
    projectionDiv.innerHTML = `
        <strong>Target Team Size: ${result.targetTeam}</strong><br>
        Net Change: ${result.netChange > 0 ? '+' : ''}${result.netChange} (${changeDirection})
    `;
    projectionDiv.className = 'workforce-projection risk-' + (result.netChange > 0 ? 'medium' : 'low');
    
    // Display hiring needs
    hiringDiv.innerHTML = `
        <h4>Hiring Requirements:</h4>
        <ul>
            <li><strong>Backfill for Attrition:</strong> ${result.attritionCount} positions</li>
            <li><strong>Net Growth Positions:</strong> ${Math.max(result.netChange, 0)} positions</li>
            <li><strong>Total Hiring Need:</strong> ${result.totalHiring} positions</li>
        </ul>
    `;
    
    // Display strategy
    if (result.strategy.length > 0) {
        strategyDiv.innerHTML = '<h4>Strategic Recommendations:</h4><ul>' + 
            result.strategy.map(s => `<li>${s}</li>`).join('') + 
            '</ul>';
    }
    
    resultDiv.classList.add('active');
    
    // Smooth scroll to result
    resultDiv.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

// ===================================
// Smooth Scroll
// ===================================
function initializeSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            
            // Skip empty anchors
            if (href === '#') return;
            
            e.preventDefault();
            
            const target = document.querySelector(href);
            if (target) {
                const offset = 80; // Offset for fixed headers if any
                const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - offset;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// ===================================
// Scroll Reveal Animation
// ===================================
function initializeScrollReveal() {
    const elements = document.querySelectorAll('.module-card, .phase-card, .hiring-card, .demo-card');
    
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in-up');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    elements.forEach(element => {
        observer.observe(element);
    });
}

// ===================================
// Mobile Sticky CTA Visibility
// ===================================
window.addEventListener('scroll', function() {
    const mobileCTA = document.querySelector('.mobile-sticky-cta');
    const contactSection = document.getElementById('contact');
    
    if (!mobileCTA || !contactSection) return;
    
    const contactPosition = contactSection.getBoundingClientRect().top;
    const windowHeight = window.innerHeight;
    
    // Hide sticky CTA when contact section is visible
    if (contactPosition < windowHeight) {
        mobileCTA.style.display = 'none';
    } else {
        mobileCTA.style.display = 'flex';
    }
});

// ===================================
// Utility Functions
// ===================================

// Debounce function for performance
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Format numbers with commas
function formatNumber(num) {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

// Log initialization
console.log('Oracle Fusion + AI Roadmap initialized successfully');
