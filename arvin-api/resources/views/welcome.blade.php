<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>403 Forbidden</title>
    <style>
        body {
            margin: 0;
            padding: 0;
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            -background: linear-gradient(135deg, #f36f6f, #f3a0a0);
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
        }

        .container {
            text-align: center;
            --background-color: #fff;
            border-radius: 12px;
            padding: 40px;
            --box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
            max-width: 400px;
            width: 100%;
        }

        h1 {
            font-size: 120px;
            margin: 0;
            color: #ff4c4c;
            font-weight: bold;
        }

        .error-message {
            font-size: 28px;
            color: #333;
            margin: 10px 0;
            font-weight: 600;
        }

        .description {
            font-size: 18px;
            color: #666;
            margin: 0;
        }

        .home-link {
            display: inline-block;
            margin-top: 20px;
            font-size: 16px;
            color: #007bff;
            text-decoration: none;
            padding: 10px 20px;
            border: 2px solid #007bff;
            border-radius: 4px;
            transition: background-color 0.3s, color 0.3s;
        }

        .home-link:hover {
            background-color: #007bff;
            color: #fff;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>403</h1>
        <p class="error-message">Forbidden</p>
        <p class="description">You don't have permission to access this page.</p>
        {{-- <a href="{{ redirect()->back() }}" class="home-link">Go to Homepage</a> --}}
    </div>
</body>
</html>