<?php

class StudentBackendService
{
    private $pdo;

    private $server_name = "localhost";
    private $username = "root";
    private $password = "";
    private $database = "prelim_db";
    private $tableName = "students_table";

    public function __construct()
    {
        try {
            $this->pdo = new PDO("mysql:host={$this->server_name};dbname={$this->database}", $this->username, $this->password);
            $this->pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
            $this->pdo->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_OBJ);
        } catch (PDOException $e) {
            die(json_encode(['error' => "Database connection failed" . $e->getMessage()]));
        }
    }

    private function response($status, $data, $e)
    {
        echo json_encode(['status' => $status, 'data' => $data, 'msg' => $e]);
    }

    public function getAllStudents()
    {
        try {
            $query = "SELECT * FROM {$this->tableName}";
            $statement = $this->pdo->prepare($query);
            $statement->execute();
            $products = $statement->fetchAll();

            if (empty($products)) {
                $this->response(404, null, 'No students found!');
            } else {
                $this->response(200, $products, null);
            }
        } catch (PDOException $e) {
            $this->response(500, null, $e->getMessage());
        }
    }

    public function getStudentById($student_id)
    {
        try {
            $query = "SELECT * FROM {$this->tableName} WHERE student_id = ?";
            $statement = $this->pdo->prepare($query);
            $statement->execute([$student_id]);
            $student = $statement->fetch();

            if ($student) {
                $this->response(200, $student, null);
            } else {
                $this->response(404, null, 'Student not found!');
            }
        } catch (PDOException $e) {
            $this->response(500, null, $e->getMessage());
        }
    }

    public function addStudent($first_name, $last_name, $email, $gender, $course, $bday, $address, $profile)
    {
        try {
            $query = "INSERT INTO students_table (first_name, last_name, email, gender, course, birthdate, user_address, profile) VALUES (?, ?, ?, ?, ?, ?, ?, ?)";
            $statement = $this->pdo->prepare($query);
            $statement->execute([$first_name, $last_name, $email, $gender, $course, $bday, $address, $profile]);

            if ($statement->rowCount() > 0) {
                $this->response(200, null, 'Student added successfully!');
            } else {
                $this->response(404, null, 'Failed to add student!');
            }
        } catch (PDOException $e) {
            $this->response(500, null, $e->getMessage());
        }
    }

    public function updateStudent($student_id, $first_name, $last_name, $email, $gender, $course, $bday, $address, $profile)
    {
        try {
            $query = "UPDATE {$this->tableName} SET first_name=?, last_name=?, email=?, gender=?, course=?, birthdate=?, user_address=?, profile=? WHERE student_id=?";
            $statement = $this->pdo->prepare($query);
            $statement->execute([$first_name, $last_name, $email, $gender, $course, $bday, $address, $profile, $student_id]);

            if ($statement->rowCount() > 0) {
                $this->response(200, null, 'Student updated successfully!');
            } else {
                $this->response(404, null, 'Failed to update student!');
            }
        } catch (PDOException $e) {
            $this->response(500, null, $e->getMessage());
        }
    }

    public function deleteStudent($student_id)
    {
        try {
            $query = "DELETE FROM students_table WHERE student_id = {$student_id}";
            $statement = $this->pdo->prepare($query);
            $statement->execute();

            if ($statement->rowCount() > 0) {
                $this->response(200, null, 'Student deleted successfully!');
            } else {
                $this->response(404, null, 'Failed to delete student! Student ID not found.');
            }
        } catch (PDOException $e) {
            $this->response(500, null, $e->getMessage());
        }
    }
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $db = new StudentBackendService();
    $action = $_POST['action'];

    switch ($action) {
        case 'get_all_students':
            $db->getAllStudents();
            break;
        case 'get_student_by_id':
            $db->getStudentById($_POST['student_id']);
            break;
        case 'add_student':
            $db->addStudent(
                $_POST['firstname'],
                $_POST['lastname'],
                $_POST['email'],
                $_POST['gender'],
                $_POST['course'],
                $_POST['birthdate'],
                $_POST['address'],
                $_POST['profileImage']
            );
            break;
        case 'update_student_by_id':
            $db->updateStudent(
                $_POST['student_id'],
                $_POST['firstname'],
                $_POST['lastname'],
                $_POST['email'],
                $_POST['gender'],
                $_POST['course'],
                $_POST['birthdate'],
                $_POST['address'],
                $_POST['profileImage'] ?? null
            );
            break;
        case 'delete_student':
            $db->deleteStudent($_POST['student_id']);
            break;
        default:
            echo json_encode(["error" => "Invalid action"]);
    }
}