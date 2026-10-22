// 문제 데이터를 JSON으로 내보내 검증 스크립트(verify_answers.py)가 읽을 수 있게 한다.
import { PROBLEMS } from '../assets/js/content/problems.js';
import { DIAGNOSIS } from '../assets/js/content/diagnosis.js';
import { UNITS, SKILLS, LEVELS } from '../assets/js/content/units.js';
import { LESSONS, CQ_RAW } from '../assets/js/content/lessons/index.js';

process.stdout.write(JSON.stringify({ PROBLEMS, DIAGNOSIS, UNITS, SKILLS, LEVELS, LESSONS, CQ_RAW }));
