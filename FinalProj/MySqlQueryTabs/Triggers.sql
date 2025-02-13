USE attendance_management;

CREATE TABLE holidays(
holiday_date DATE PRIMARY KEY);

INSERT INTO holidays values
("2025-01-01"),
("2025-01-13"),
("2025-01-14"),
("2025-01-15"),
("2025-01-16"),
("2025-01-26");


-- Checks for Holiday and Sundays 
DELIMITER $$
CREATE TRIGGER before_insert_attendance
BEFORE INSERT ON attendance
FOR EACH ROW
BEGIN
	IF EXISTS(SELECT 1 FROM holidays WHERE holiday_date =NEW.date) THEN
		SET NEW.status = "Holiday";
        
	ELSEIF DAYOFWEEK(NEW.date) = 1 THEN
		SET NEW.status = "Sunday";
	
    END IF;
END $$
DELIMITER ;




DELIMITER $$
CREATE PROCEDURE autoinsert_attendance()
BEGIN
	DECLARE currentdate DATE;
    DECLARE is_holiday BOOLEAN;
    DECLARE is_sunday BOOLEAN;
    
    SET currentdate = CURDATE();
    SET is_holiday = EXISTS(SELECT 1 FROM holidays WHERE holiday_date=currentdate);
    SET is_sunday = (dayofweek(current_date)=1);
    
    IF is_holiday OR is_sunday THEN
		INSERT INTO attendance(user_id, date, status)
        SELECT id, current_date,
			CASE 
				WHEN is_holiday THEN "Holiday"
                WHEN is_sunday THEN "Sunday"
			END
		FROM users;
	END IF;    
end $$
DELIMITER ;


CREATE EVENT daily_attendance_check
ON SCHEDULE EVERY 1 day
STARTS TIMESTAMP(CURRENT_DATE, '00:00:01')
DO
CALL autoinsert_attendance();


DELIMITER $$
CREATE EVENT CheckAttendanceAndLeaveRequests
ON SCHEDULE EVERY 1 DAY
STARTS TIMESTAMP(CURRENT_DATE, '10:00:00')
DO
BEGIN
    DECLARE currentdate DATE;
    SET currentdate = CURDATE();

    -- Insert "Absent" records for users without LeaveRequest or Attendance for the current date
    INSERT INTO Attendance (user_id, date, status, created_at, updated_at)
    SELECT u.id, currentdate, 'Absent', NOW(), NOW()
    FROM Users u
    LEFT JOIN LeaveRequests lr ON u.id = lr.user_id AND lr.date = currentdate
    LEFT JOIN Attendance a ON u.id = a.user_id AND a.date = currentdate
    LEFT JOIN AttendanceRequests ar ON u.id = ar.user_id AND a.date = currentdate
    WHERE lr.id IS NULL AND a.id IS NULL AND ar.id IS NULL;
END$$
DELIMITER ;
	
SHOW TRIGGERS;
SHOW EVENTS;