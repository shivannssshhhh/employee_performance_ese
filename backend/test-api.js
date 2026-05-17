const testAPIs = async () => {
  try {
    // 1. POST Candidate
    console.log('Testing POST /api/candidates...');
    const postRes = await fetch('http://localhost:5001/api/candidates', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Jane Doe',
        email: 'jane@example.com',
        skills: ['React', 'Node.js', 'MongoDB'],
        experience: 3,
        bio: 'Full Stack Developer'
      })
    });
    const postData = await postRes.json();
    console.log('POST Response:', postData);

    // 2. GET Candidates
    console.log('\nTesting GET /api/candidates...');
    const getRes = await fetch('http://localhost:5001/api/candidates');
    const getData = await getRes.json();
    console.log('GET Response length:', getData.length);

    // 3. Match APIs
    console.log('\nTesting POST /api/match...');
    const matchRes = await fetch('http://localhost:5001/api/match', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        requiredSkills: ['React', 'Node.js'],
        minExperience: 1
      })
    });
    const matchData = await matchRes.json();
    console.log('Match Response total:', matchData.total);

    // 4. AI Shortlist APIs
    console.log('\nTesting POST /api/ai/shortlist...');
    const aiRes = await fetch('http://localhost:5001/api/ai/shortlist', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        requiredSkills: ['React', 'Node.js'],
        minExperience: 1,
        jobDescription: 'Looking for a solid MERN stack developer.'
      })
    });
    const aiData = await aiRes.json();
    console.log('AI Response total:', aiData.total);
    console.log('AI Response Summary:', aiData.aiSummary);

  } catch (err) {
    console.error('Test script error:', err);
  }
};

testAPIs();
