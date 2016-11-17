(if [[ "$TRAVIS_JOB_NUMBER" == *.1 ]]; 
    then npm run cover:lcov; 
    else npm test; 
fi)
