#model.py 
from tensorflow.keras.applications import EfficientNetB0
from tensorflow.keras.models import Model
from tensorflow.keras.layers import Dense, GlobalAveragePooling2D
from tensorflow.keras.preprocessing.image import ImageDataGenerator
from tensorflow.keras.optimizers import Adam

# This function builds and returns my forgery detection model.
def create_model():
    # I'm using EfficientNetB0 as the base model because it's lightweight and accurate.
    base_model = EfficientNetB0(include_top=False, weights='imagenet', input_shape=(224, 224, 3))
    
    # After removing the top layer, I apply global average pooling to reduce spatial dimensions.
    x = base_model.output
    x = GlobalAveragePooling2D()(x)
    
    # Then I add a fully connected layer to extract more abstract features.
    x = Dense(128, activation='relu')(x)
    
    # This final layer outputs a single probability—1 for tampered, 0 for authentic.
    predictions = Dense(1, activation='sigmoid')(x)
    
    # Here's the full model using the base and my custom classifier head.
    model = Model(inputs=base_model.input, outputs=predictions)
    
    # I froze the base model layers to avoid retraining them—this speeds things up and prevents overfitting.
    for layer in base_model.layers:
        layer.trainable = False  # Freeze base layers
    
    # I'm using Adam optimizer with a low learning rate for stable fine-tuning.
    model.compile(optimizer=Adam(1e-4), loss='binary_crossentropy', metrics=['accuracy'])
    
    # Finally, I load the pre-trained weights that were already fine-tuned.
    model.load_weights("model_weights.h5")  # Pretrained weights
    return model
