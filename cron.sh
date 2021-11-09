#!/bin/bash
(crontab -l 2>/dev/null; echo "0 0 * * * /path/to/job -with args") | crontab -