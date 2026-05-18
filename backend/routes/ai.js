const express = require('express');
const router = express.Router();
const fetch = require('node-fetch');
const Employee = require('../models/Employee');
const auth = require('../middleware/auth');

router.post('/recommend', auth, async (req, res) => {
  try {
    const { department, minScore, limit = 10 } = req.body;
    
    // Find employees to analyze
    let query = {};
    if (department) query.department = department;
    if (minScore) query.performanceScore = { $gte: minScore };
    
    const employees = await Employee.find(query).limit(limit);

    if (employees.length === 0) {
      return res.json({ message: 'No employees found matching criteria.', rankings: [], departmentSummary: 'N/A' });
    }

    const employeeList = employees.map((e, i) => 
      `${i + 1}. Name: ${e.name} | Dept: ${e.department} | Skills: ${e.skills.join(', ')} | Score: ${e.performanceScore} | Experience: ${e.experience} years`
    ).join('\n');

    const prompt = `You are an expert HR AI Analytics assistant. Analyze these employees and provide performance insights.

EMPLOYEES:
${employeeList}

Respond ONLY with a valid JSON object in this exact format:
{
  "rankings": [
    {
      "name": "employee name",
      "department": "department name",
      "rank": 1,
      "promotionRecommendation": "Yes/No - and brief reason",
      "trainingSuggestions": ["suggestion 1", "suggestion 2"],
      "improvementFeedback": "constructive feedback"
    }
  ],
  "departmentSummary": "overall summary of the analyzed employees"
}

Rules:
- rank 1 is the best performing employee based on score and experience.
- Include ALL provided employees sorted by rank.
- Return pure JSON only, no markdown.`;

    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': 'http://localhost:3000',
        'X-Title': 'Employee Performance System'
      },
      body: JSON.stringify({
        model: 'openai/gpt-4o-mini',
        messages: [{ role: 'user', content: prompt }],
        max_tokens: 2500
      })
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('OpenRouter error:', data);
      return res.status(500).json({ error: data.error?.message || 'OpenRouter API failed' });
    }

    const rawText = data.choices[0].message.content.trim();
    const jsonMatch = rawText.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      return res.status(500).json({ error: 'AI response parsing failed' });
    }

    const aiResult = JSON.parse(jsonMatch[0]);
    res.json(aiResult);

  } catch (err) {
    console.error('AI recommend error:', err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
