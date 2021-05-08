CREATE TABLE vaccinations (
  id SERIAL NOT NULL,
  "date" date,
  country VARCHAR(20),
  state VARCHAR(20),
  cases FLOAT,
  new_cases FLOAT,
  vaccines_distributed FLOAT,
  vaccines_initiated FLOAT,
  vaccines_completed FLOAT,
  infection_rate FLOAT,
  CONSTRAINT PK_date PRIMARY KEY(date, state)
);


select * from vaccinations